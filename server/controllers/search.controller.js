import axios from 'axios';
import dotenv from 'dotenv';
import Search from '../models/search.model.js';

dotenv.config();

// Openverse API base URL
const OPENVERSE_API_BASE_URL = "https://api.openverse.org/v1";

// Openverse API credentials (optional for many endpoints)
const OPENVERSE_CLIENT_ID = process.env.OPENVERSE_CLIENT_ID;
const OPENVERSE_CLIENT_SECRET = process.env.OPENVERSE_CLIENT_SECRET;

// Token management
let accessToken = null;
let tokenExpiry = null;

/**
 * Get a valid access token for Openverse API (optional for many endpoints)
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
      }
    });

    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in * 1000);
    
    console.log('Successfully obtained Openverse API access token');
    return accessToken;
  } catch (error) {
    console.error('Error getting access token:', error.response?.data || error.message);
    console.log('Will attempt to use Openverse API without authentication');
    return null;
  }
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

    // For quick testing, skip authentication
    // You can re-enable this later if needed
    // const token = await getAccessToken();
    
    // Make request to Openverse API without authentication
    const endpoint = `${OPENVERSE_API_BASE_URL}/${mediaType === 'audio' ? 'audio' : 'images'}/`;
    
    console.log(`Searching ${mediaType} with query "${query}" on page ${page}`);
    
    const response = await axios.get(endpoint, {
      params: {
        q: query,
        page,
        page_size: pageSize,
        ...formatFilters(filters, mediaType)
      }
    });

    // If user is logged in, save search to history
    if (userId) {
      await Search.create({
        userId,
        query,
        mediaType,
        filters: { ...filters, page, pageSize },
        timestamp: new Date()
      });
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

    // Get access token (may be null if credentials not set)
    const token = await getAccessToken();

    // Prepare headers - include Authorization header only if token exists
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Make request to Openverse API
    const endpoint = `${OPENVERSE_API_BASE_URL}/${mediaType === 'audio' ? 'audio' : 'images'}/${id}/`;
    
    const response = await axios.get(endpoint, { headers });

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