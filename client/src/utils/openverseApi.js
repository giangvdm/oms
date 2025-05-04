import axios from 'axios';

class OpenverseApi {
  constructor() {
    this.baseUrl = 'https://api.openverse.org/v1';
    this.accessToken = null;
    this.tokenExpiry = null;
    this.maxRetries = 3;
    this.retryDelay = 1000; // milliseconds
    this.unauthenticatedMode = false;
  }

  /**
   * Initialize with client credentials
   * @param {string} clientId - Your Openverse API client ID
   * @param {string} clientSecret - Your Openverse API client secret
   */
  init(clientId, clientSecret) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  /**
   * Retry a function with exponential backoff
   */
  async retry(fn, retries = this.maxRetries, delay = this.retryDelay) {
    try {
      return await fn();
    } catch (error) {
      if (retries <= 0) {
        throw error;
      }
      
      console.log(`Retrying after ${delay}ms, ${retries} retries left`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return this.retry(fn, retries - 1, delay * 2);
    }
  }

  /**
   * Check if token is valid and get a new one if needed
   */
  async ensureValidToken() {
    // If we're in unauthenticated mode, don't try to get a token
    if (this.unauthenticatedMode) {
      return null;
    }
    
    const now = Date.now();
    
    // If token is expired or will expire in the next 5 minutes
    if (!this.accessToken || !this.tokenExpiry || this.tokenExpiry - now < 300000) {
      try {
        await this.getAccessToken();
      } catch (error) {
        console.warn('Failed to get access token, falling back to unauthenticated mode', error);
        this.unauthenticatedMode = true;
        return null;
      }
    }
    
    return this.accessToken;
  }

  /**
   * Get a new access token from Openverse API
   */
  async getAccessToken() {
    if (!this.clientId || !this.clientSecret) {
      console.warn('No client credentials provided, using unauthenticated mode');
      this.unauthenticatedMode = true;
      return null;
    }
    
    return this.retry(async () => {
      try {
        // Openverse API now expects form data instead of JSON for token requests
        const formData = new URLSearchParams();
        formData.append('client_id', this.clientId);
        formData.append('client_secret', this.clientSecret);
        formData.append('grant_type', 'client_credentials');
        
        const response = await axios.post(`${this.baseUrl}/auth_tokens/token/`, formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
        
        this.accessToken = response.data.access_token;
        this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
        this.unauthenticatedMode = false;
        
        console.log('Successfully obtained Openverse API access token');
        return this.accessToken;
      } catch (error) {
        console.error('Error getting access token:', error.response?.data || error.message);
        throw error;
      }
    });
  }

  /**
   * Create request headers with auth token if available
   */
  async getHeaders() {
    const token = await this.ensureValidToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  /**
   * Search for media (images or audio)
   * @param {string} mediaType - 'images' or 'audio'
   * @param {string} query - Search query
   * @param {Object} params - Additional search parameters
   * @returns {Promise<Object>} - Search results
   */
  async searchMedia(mediaType, query, params = {}) {
    if (!['images', 'audio'].includes(mediaType)) {
      throw new Error('Media type must be "images" or "audio"');
    }
    
    return this.retry(async () => {
      try {
        const headers = await this.getHeaders();
        
        const response = await axios.get(`${this.baseUrl}/${mediaType}/`, {
          headers,
          params: {
            q: query,
            page_size: params.pageSize || 20,
            page: params.page || 1,
            ...params
          },
          timeout: 10000, // 10 second timeout
        });
        
        return response.data;
      } catch (error) {
        console.error(`Error searching Openverse ${mediaType}:`, error.response?.data || error.message);
        throw error;
      }
    });
  }

  /**
   * Get details for a specific media item
   * @param {string} mediaType - 'images' or 'audio'
   * @param {string} id - Media ID
   * @returns {Promise<Object>} - Media details
   */
  async getMediaDetails(mediaType, id) {
    if (!['images', 'audio'].includes(mediaType)) {
      throw new Error('Media type must be "images" or "audio"');
    }
    
    return this.retry(async () => {
      try {
        const headers = await this.getHeaders();
        
        const response = await axios.get(`${this.baseUrl}/${mediaType}/${id}/`, {
          headers,
          timeout: 8000 // 8 second timeout
        });
        
        return response.data;
      } catch (error) {
        console.error(`Error getting ${mediaType} details:`, error.response?.data || error.message);
        throw error;
      }
    });
  }

  /**
   * Reset API client state (useful for testing or when credentials change)
   */
  reset() {
    this.accessToken = null;
    this.tokenExpiry = null;
    this.unauthenticatedMode = false;
  }
}

// Create a singleton instance
const openverseApi = new OpenverseApi();
export default openverseApi;