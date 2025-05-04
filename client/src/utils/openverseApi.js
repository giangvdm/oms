// src/utils/openverseApi.js
import axios from 'axios';

class OpenverseApi {
  constructor() {
    this.baseUrl = 'https://api.openverse.org/v1';
    this.accessToken = null;
    this.tokenExpiry = null;
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
   * Check if token is valid and get a new one if needed
   */
  async ensureValidToken() {
    const now = Date.now();
    
    // If token is expired or will expire in the next 5 minutes
    if (!this.accessToken || !this.tokenExpiry || this.tokenExpiry - now < 300000) {
      await this.getAccessToken();
    }
    
    return this.accessToken;
  }

  /**
   * Get a new access token from Openverse API
   */
  async getAccessToken() {
    try {
      const response = await axios.post(`${this.baseUrl}/auth_tokens/token/`, {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      });
      
      this.accessToken = response.data.access_token;
      
      // Token expiry time in milliseconds (token lasts 43200 seconds = 12 hours)
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
      
      return this.accessToken;
    } catch (error) {
      console.error('Error getting Openverse access token:', error);
      throw new Error('Failed to authenticate with Openverse API');
    }
  }

  /**
   * Search for images
   * @param {string} query - Search query
   * @param {Object} params - Additional search parameters
   * @returns {Promise<Object>} - Search results
   */
  async searchImages(query, params = {}) {
    await this.ensureValidToken();
    
    try {
      const response = await axios.get(`${this.baseUrl}/images/`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        },
        params: {
          q: query,
          page_size: params.pageSize || 20,
          page: params.page || 1,
          ...params
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error searching Openverse images:', error);
      throw new Error('Failed to search Openverse images');
    }
  }

  /**
   * Search for audio
   * @param {string} query - Search query
   * @param {Object} params - Additional search parameters
   * @returns {Promise<Object>} - Search results
   */
  async searchAudio(query, params = {}) {
    await this.ensureValidToken();
    
    try {
      const response = await axios.get(`${this.baseUrl}/audio/`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        },
        params: {
          q: query,
          page_size: params.pageSize || 20,
          page: params.page || 1,
          ...params
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error searching Openverse audio:', error);
      throw new Error('Failed to search Openverse audio');
    }
  }

  /**
   * Get details for a specific image
   * @param {string} id - Image ID
   * @returns {Promise<Object>} - Image details
   */
  async getImageDetails(id) {
    await this.ensureValidToken();
    
    try {
      const response = await axios.get(`${this.baseUrl}/images/${id}/`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error getting image details:', error);
      throw new Error('Failed to get image details');
    }
  }

  /**
   * Get details for a specific audio
   * @param {string} id - Audio ID
   * @returns {Promise<Object>} - Audio details
   */
  async getAudioDetails(id) {
    await this.ensureValidToken();
    
    try {
      const response = await axios.get(`${this.baseUrl}/audio/${id}/`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error getting audio details:', error);
      throw new Error('Failed to get audio details');
    }
  }
}

// Create a singleton instance
const openverseApi = new OpenverseApi();
export default openverseApi;