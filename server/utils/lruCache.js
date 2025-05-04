/**
 * Simple LRU (Least Recently Used) Cache implementation
 */
export class LRUCache {
    constructor(maxSize = 1000, ttl = 3600000) { // Default 1hr TTL
      this.maxSize = maxSize;
      this.ttl = ttl;
      this.cache = new Map();
    }
    
    /**
     * Get an item from the cache
     * @param {string} key - Cache key
     * @returns {*} - Cached value or undefined if not found/expired
     */
    get(key) {
      if (!this.cache.has(key)) {
        return undefined;
      }
      
      const item = this.cache.get(key);
      
      // Check if item is expired
      if (Date.now() > item.expiry) {
        this.cache.delete(key);
        return undefined;
      }
      
      // Update item to be most recently used
      this.cache.delete(key);
      this.cache.set(key, item);
      
      return item.value;
    }
    
    /**
     * Set an item in the cache
     * @param {string} key - Cache key
     * @param {*} value - Value to cache
     * @param {number} [customTtl] - Optional custom TTL in milliseconds
     */
    set(key, value, customTtl) {
      // If cache is at max size, remove least recently used item
      if (this.cache.size >= this.maxSize) {
        const oldestKey = this.cache.keys().next().value;
        this.cache.delete(oldestKey);
      }
      
      // Add new item
      this.cache.set(key, {
        value,
        expiry: Date.now() + (customTtl || this.ttl)
      });
    }
    
    /**
     * Remove an item from the cache
     * @param {string} key - Cache key
     * @returns {boolean} - True if item was removed, false if not found
     */
    delete(key) {
      return this.cache.delete(key);
    }
    
    /**
     * Clear all items from the cache
     */
    clear() {
      this.cache.clear();
    }
    
    /**
     * Get the number of items in the cache
     * @returns {number} - Number of items
     */
    size() {
      return this.cache.size;
    }
    
    /**
     * Cleanup expired items (useful for periodic maintenance)
     * @returns {number} - Number of items removed
     */
    cleanup() {
      let count = 0;
      const now = Date.now();
      
      for (const [key, item] of this.cache.entries()) {
        if (now > item.expiry) {
          this.cache.delete(key);
          count++;
        }
      }
      
      return count;
    }
  }