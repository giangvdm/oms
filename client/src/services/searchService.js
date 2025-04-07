import axios from 'axios';

const API_URL = '/api/search';

// Get auth token from local storage
const getToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token;
};

/**
 * Search for media (images or audio)
 * @param {string} query - Search query
 * @param {Object} options - Search options (mediaType, filters, pagination)
 */
export const searchMedia = async (query, options = {}) => {
  const { mediaType = 'images', page = 1, pageSize = 20, ...filters } = options;
  
  try {
    const response = await axios.get(API_URL, {
      params: {
        query,
        mediaType,
        page,
        pageSize,
        ...filters
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error searching media:', error);
    throw error;
  }
};

/**
 * Get details for a specific media item
 * @param {string} id - Media ID
 * @param {string} mediaType - 'images' or 'audio'
 */
export const getMediaDetails = async (id, mediaType = 'images') => {
  try {
    const response = await axios.get(`${API_URL}/details/${id}`, {
      params: { mediaType }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting media details:', error);
    throw error;
  }
};

/**
 * Get user's search history
 * Requires authentication
 */
export const getSearchHistory = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await axios.get(`${API_URL}/history`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting search history:', error);
    throw error;
  }
};

/**
 * Delete a search from history
 * @param {string} searchId - ID of the search to delete
 * Requires authentication
 */
export const deleteSearch = async (searchId) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await axios.delete(`${API_URL}/history/${searchId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error deleting search:', error);
    throw error;
  }
};