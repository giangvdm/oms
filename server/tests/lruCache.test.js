import { LRUCache } from '../utils/lruCache.js';

describe('LRU Cache', () => {
  let cache;
  
  beforeEach(() => {
    // Create a new cache before each test with a small size for testing
    cache = new LRUCache(3, 100); // Size 3, TTL 100ms
  });
  
  test('should store and retrieve values', () => {
    cache.set('key1', 'value1');
    expect(cache.get('key1')).toBe('value1');
  });
  
  test('should return undefined for non-existent keys', () => {
    expect(cache.get('nonexistent')).toBeUndefined();
  });
  
  test('should evict least recently used items when full', () => {
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    cache.set('key3', 'value3');
    
    // Access key1 to make it recently used
    cache.get('key1');
    
    // Add a new item, should evict key2 (least recently used)
    cache.set('key4', 'value4');
    
    expect(cache.get('key1')).toBe('value1');
    expect(cache.get('key2')).toBeUndefined();
    expect(cache.get('key3')).toBe('value3');
    expect(cache.get('key4')).toBe('value4');
  });
  
  test('should expire items after TTL', async () => {
    cache.set('key1', 'value1');
    
    // Wait for TTL to expire
    await new Promise(resolve => setTimeout(resolve, 150));
    
    expect(cache.get('key1')).toBeUndefined();
  });
  
  test('should allow custom TTL per item', async () => {
    cache.set('key1', 'value1'); // Default TTL (100ms)
    cache.set('key2', 'value2', 200); // Custom TTL (200ms)
    
    // Wait for default TTL to expire
    await new Promise(resolve => setTimeout(resolve, 150));
    
    expect(cache.get('key1')).toBeUndefined();
    expect(cache.get('key2')).toBe('value2');
    
    // Wait for custom TTL to expire
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(cache.get('key2')).toBeUndefined();
  });
  
  test('should delete items', () => {
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    
    expect(cache.delete('key1')).toBe(true);
    expect(cache.get('key1')).toBeUndefined();
    expect(cache.get('key2')).toBe('value2');
    
    // Should return false for non-existent key
    expect(cache.delete('nonexistent')).toBe(false);
  });
  
  test('should clear all items', () => {
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    
    cache.clear();
    
    expect(cache.get('key1')).toBeUndefined();
    expect(cache.get('key2')).toBeUndefined();
    expect(cache.size()).toBe(0);
  });
  
  test('should cleanup expired items', async () => {
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    cache.set('key3', 'value3', 200); // Custom TTL
    
    // Wait for default TTL to expire
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // key1 and key2 should be expired, key3 should still be valid
    const removedCount = cache.cleanup();
    
    expect(removedCount).toBe(2);
    expect(cache.get('key1')).toBeUndefined();
    expect(cache.get('key2')).toBeUndefined();
    expect(cache.get('key3')).toBe('value3');
    expect(cache.size()).toBe(1);
  });
});