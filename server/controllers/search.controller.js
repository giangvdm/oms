import axios from 'axios';
import dotenv from 'dotenv';
import Search from '../models/search.model.js';
import { LRUCache } from '../utils/lruCache.js';

dotenv.config();

// Openverse API base URL
const OPENVERSE_API_BASE_URL = "https://api.openverse.org/v1";

// Openverse API credentials
const OPENVERSE_CLIENT_ID = process.env.OPENVERSE_CLIENT_ID;
const OPENVERSE_CLIENT_SECRET = process.env.OPENVERSE_CLIENT_SECRET;

// Cache for API results (LRU = Least Recently Used)
// Create a cache with max 1000 items and 10 minute expiry
const apiCache = new LRUCache(1000, 10 * 60 * 1000);

// Token management
let accessToken = null;
let tokenExpiry = null;
let tokenAcquisitionInProgress = false;
let tokenAcquisitionQueue = [];

/**
 * Get a valid access token for Openverse API with concurrency control
 */
const getAccessToken = async () => {
  // If credentials aren't set, return null (will use unauthenticated access)
  if (!OPENVERSE_CLIENT_ID || !OPENVERSE_CLIENT_SECRET) {
    console.log('Openverse API credentials not configured. Using unauthenticated access.');
    return null;
  }

  // Check if we have a valid token
  const now = Date.now();
  if (accessToken && tokenExpiry && tokenExpiry > now) {
    return accessToken;
  }
  
  // If token acquisition is already in progress, wait for it to complete
  if (tokenAcquisitionInProgress) {
    return new Promise((resolve, reject) => {
      tokenAcquisitionQueue.push({ resolve, reject });
    });
  }
  
  // Set flag to indicate token acquisition is in progress
  tokenAcquisitionInProgress = true;

  try {
    console.log('Getting new Openverse API access token...');
    
    // Openverse API now expects form data instead of JSON for token requests
    const formData = new URLSearchParams();
    formData.append('client_id', OPENVERSE_CLIENT_ID);
    formData.append('client_secret', OPENVERSE_CLIENT_SECRET);
    formData.append('grant_type', 'client_credentials');
    
    const response = await axios.post(`${OPENVERSE_API_BASE_URL}/auth_tokens/token/`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      timeout: 10000 // 10 second timeout
    });

    accessToken = response.data.access_token;
    // Expire token 5 minutes before actual expiry to ensure we refresh it early
    tokenExpiry = Date.now() + ((response.data.expires_in - 300) * 1000);
    
    console.log('Successfully obtained Openverse API access token');
    
    // Resolve any pending promises
    tokenAcquisitionQueue.forEach(({ resolve }) => resolve(accessToken));
    tokenAcquisitionQueue = [];
    
    return accessToken;
  } catch (error) {
    console.error('Error getting access token:', error.response?.data || error.message);
    
    // Reject any pending promises
    tokenAcquisitionQueue.forEach(({ reject }) => reject(error));
    tokenAcquisitionQueue = [];
    
    return null;
  } finally {
    // Reset flag
    tokenAcquisitionInProgress = false;
  }
};

/**
 * Retry a function with exponential backoff
 */
const retry = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    
    console.log(`Retrying after ${delay}ms, ${retries} retries left`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return retry(fn, retries - 1, delay * 2);
  }
};

/**
 * Generate cache key for search parameters
 */
const generateCacheKey = (params) => {
  return `${params.mediaType || 'images'}:${params.query}:${params.page || 1}:${params.pageSize || 20}:${JSON.stringify(params.filters || {})}`;
};

/**
 * Search for media (images or audio)
 */
export const searchMedia = async (req, res) => {
  try {
    const { query, mediaType = 'images', page = 1, pageSize = 20, ...filters } = req.query;
    const userId = req.user?.id; // User ID from auth middleware
    
    if (!query) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }
    
    // Generate cache key
    const cacheKey = generateCacheKey(req.query);
    
    // Check cache
    const cachedResult = apiCache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached search results');
      
      // If user is logged in, still save search to history
      if (userId) {
        try {
          await Search.create({
            userId,
            query,
            mediaType,
            filters: { ...filters, page, pageSize },
            timestamp: new Date()
          });
        } catch (historyError) {
          console.error('Error saving search to history:', historyError);
          // Continue processing even if history saving fails
        }
      }
      
      return res.status(200).json({
        success: true,
        data: cachedResult,
        fromCache: true
      });
    }

    // Get token (may be null if credentials not set)
    const token = await getAccessToken();

    // Prepare headers - include Authorization header only if token exists
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Make request to Openverse API with retry logic
    const response = await retry(async () => {
      console.log(`Searching ${mediaType} with query "${query}" on page ${page}`);
      
      const endpoint = `${OPENVERSE_API_BASE_URL}/${mediaType === 'audio' ? 'audio' : 'images'}/`;
      
      return axios.get(endpoint, {
        headers,
        params: {
          q: query,
          page,
          page_size: pageSize,
          ...formatFilters(filters, mediaType)
        },
        timeout: 15000 // 15 second timeout
      });
    });

    // Cache successful results
    apiCache.set(cacheKey, response.data);

    // If user is logged in, save search to history
    if (userId) {
      try {
        await Search.create({
          userId,
          query,
          mediaType,
          filters: { ...filters, page, pageSize },
          timestamp: new Date()
        });
      } catch (historyError) {
        console.error('Error saving search to history:', historyError);
        // Continue processing even if history saving fails
      }
    }

    res.status(200).json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error('Search error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Error searching media',
      error: error.response?.data?.detail || error.message
    });
  }
};

/**
 * Get media details by ID
 */
export const getMediaDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { mediaType = 'images' } = req.query;
    
    if (!id) {
      return res.status(400).json({ success: false, message: 'Media ID is required' });
    }
    
    // Generate cache key for details
    const cacheKey = `details:${mediaType}:${id}`;
    
    // Check cache
    const cachedResult = apiCache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached media details');
      return res.status(200).json({
        success: true,
        data: cachedResult,
        fromCache: true
      });
    }

    // Get access token (may be null if credentials not set)
    const token = await getAccessToken();

    // Prepare headers - include Authorization header only if token exists
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Make request to Openverse API
    const endpoint = `${OPENVERSE_API_BASE_URL}/${mediaType === 'audio' ? 'audio' : 'images'}/${id}/`;
    
    const response = await retry(async () => {
      return axios.get(endpoint, { 
        headers,
        timeout: 10000 // 10 second timeout
      });
    });
    
    // Cache successful results
    apiCache.set(cacheKey, response.data);

    res.status(200).json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error('Get media details error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching media details',
      error: error.response?.data?.detail || error.message
    });
  }
};

/**
 * Get user's search history
 */
export const getSearchHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const searchHistory = await Search.find({ userId })
      .sort({ timestamp: -1 }) // Most recent first
      .limit(20);
    
    res.status(200).json({
      success: true,
      data: searchHistory
    });
  } catch (error) {
    console.error('Get search history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching search history',
      error: error.message
    });
  }
};

/**
 * Delete a search from history
 */
export const deleteSearch = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const search = await Search.findById(id);
    
    if (!search) {
      return res.status(404).json({
        success: false,
        message: 'Search not found'
      });
    }
    
    // Ensure user only deletes their own search history
    if (search.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this search'
      });
    }
    
    await Search.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: 'Search deleted successfully'
    });
  } catch (error) {
    console.error('Delete search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting search',
      error: error.message
    });
  }
};

/**
 * Format filters for the Openverse API
 * Transforms frontend filter names to the API expected parameters
 */
const formatFilters = (filters, mediaType) => {
  const formattedFilters = {};
  
  // Common filters for both media types
  if (filters.license) {
    formattedFilters.license = filters.license;
  }
  
  if (filters.licenseType) {
    formattedFilters.license_type = filters.licenseType;
  }
  
  if (filters.creator) {
    formattedFilters.creator = filters.creator;
  }
  
  if (filters.tags) {
    formattedFilters.tags = filters.tags;
  }
  
  if (filters.title) {
    formattedFilters.title = filters.title;
  }
  
  // Additional filters specific to images or audio
  if (mediaType === 'images') {
    if (filters.source) {
      formattedFilters.source = filters.source;
    }
    
    if (filters.category) {
      formattedFilters.category = filters.category;
    }
    
    if (filters.size) {
      formattedFilters.size = filters.size;
    }
  } else if (mediaType === 'audio') {
    if (filters.duration) {
      formattedFilters.duration = filters.duration;
    }
    
    if (filters.genres) {
      formattedFilters.genres = filters.genres;
    }
  }
  
  return formattedFilters;
};