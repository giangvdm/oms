import axios from 'axios';
import openverseApi from '../utils/openverseApi';

// In-memory cache for search results
const searchCache = new Map();
const CACHE_EXPIRY = 10 * 60 * 1000; // 10 minutes in milliseconds

/**
 * Generate cache key for search parameters
 */
const generateCacheKey = (query, options) => {
  return `${query}:${options.mediaType}:${options.page}:${options.pageSize}:${JSON.stringify(options.filters || {})}`;
};

/**
 * Check if cached result is still valid
 */
const isCacheValid = (cacheEntry) => {
  return cacheEntry && Date.now() - cacheEntry.timestamp < CACHE_EXPIRY;
};

/**
 * Search for media using backend API with fallback to direct Openverse API
 */
export const searchMedia = async (query, options = {}) => {
  if (!query.trim()) {
    throw new Error('Search query is required');
  }
  
  // Generate cache key
  const cacheKey = generateCacheKey(query, options);
  
  // Check cache
  const cachedResult = searchCache.get(cacheKey);
  if (isCacheValid(cachedResult)) {
    console.log('Returning cached search results');
    return cachedResult.data;
  }
  
  // Try to use our backend API first
  try {
    const response = await axios.get('/api/search', {
      params: {
        query,
        mediaType: options.mediaType || 'images',
        page: options.page || 1,
        pageSize: options.pageSize || 20,
        ...options.filters
      },
      timeout: 8000 // 8 second timeout
    });
    
    // Cache successful result
    searchCache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now()
    });
    
    return response.data;
  } catch (error) {
    console.warn('Backend API search failed, falling back to direct Openverse API', error);
    
    // Fallback to direct Openverse API
    try {
      // Initialize Openverse API if not already (can be called multiple times safely)
      // In production, you'd use environment variables for these values
      openverseApi.init(
        process.env.OPENVERSE_CLIENT_ID,
        process.env.OPENVERSE_CLIENT_SECRET
      );
      
      const mediaType = options.mediaType || 'images';
      const result = await openverseApi.searchMedia(mediaType, query, {
        page_size: options.pageSize || 20,
        page: options.page || 1,
        ...options.filters
      });
      
      // Transform result to match our API format
      const transformedResult = {
        success: true,
        data: {
          results: result.results,
          page_count: result.page_count,
          count: result.count
        }
      };
      
      // Cache successful result
      searchCache.set(cacheKey, {
        data: transformedResult,
        timestamp: Date.now()
      });
      
      return transformedResult;
    } catch (fallbackError) {
      console.error('Both backend and direct API searches failed', fallbackError);
      throw new Error('Failed to search media: Network or API issue');
    }
  }
};

/**
 * Get details for a specific media item with fallback
 */
export const getMediaDetails = async (id, mediaType = 'images') => {
  if (!id) {
    throw new Error('Media ID is required');
  }
  
  // Cache key for details
  const cacheKey = `details:${mediaType}:${id}`;
  
  // Check cache
  const cachedResult = searchCache.get(cacheKey);
  if (isCacheValid(cachedResult)) {
    console.log('Returning cached media details');
    return cachedResult.data;
  }
  
  // Try to use our backend API first
  try {
    const response = await axios.get(`/api/search/details/${id}`, {
      params: { mediaType },
      timeout: 8000
    });
    
    // Cache successful result
    searchCache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now()
    });
    
    return response.data;
  } catch (error) {
    console.warn('Backend API details fetch failed, falling back to direct Openverse API', error);
    
    // Fallback to direct Openverse API
    try {
      // Initialize Openverse API if not already
      openverseApi.init(
        process.env.REACT_APP_OPENVERSE_CLIENT_ID,
        process.env.REACT_APP_OPENVERSE_CLIENT_SECRET
      );
      
      const result = await openverseApi.getMediaDetails(mediaType, id);
      
      // Transform result to match our API format
      const transformedResult = {
        success: true,
        data: result
      };
      
      // Cache successful result
      searchCache.set(cacheKey, {
        data: transformedResult,
        timestamp: Date.now()
      });
      
      return transformedResult;
    } catch (fallbackError) {
      console.error('Both backend and direct API details fetches failed', fallbackError);
      throw new Error('Failed to get media details: Network or API issue');
    }
  }
};

/**
 * Get user's search history
 */
export const getSearchHistory = async () => {
  try {
    const response = await axios.get('/api/search/history');
    return response.data;
  } catch (error) {
    console.error('Error getting search history:', error);
    throw error;
  }
};

/**
 * Delete a search from history
 */
export const deleteSearch = async (searchId) => {
  try {
    const response = await axios.delete(`/api/search/history/${searchId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting search:', error);
    throw error;
  }
};

/**
 * Clear search cache
 */
export const clearSearchCache = () => {
  searchCache.clear();
};