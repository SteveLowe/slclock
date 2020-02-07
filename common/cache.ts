/**
 * Simple in-memory cache
 */

import { isRecent } from ".";

export interface CacheItem {
  /**
   * timestamp of the cache item, as an ISO3166 formatted string
   * Ideally this is the time the data was generated
   */
  timestamp: string;
}

let memoryCache: { [key: string]: CacheItem } = {};

function remove(key: string): void {
  delete memoryCache[key];
}

/**
 * Reads an item from the cache
 * @param key cache Key
 * @param ttl Number of seconds to cache the item for
 */
function get<T extends CacheItem>(key: string, ttl: number): T | undefined {
  if (key in memoryCache) {
    const item = memoryCache[key] as T;
    if (isRecent(item.timestamp, ttl)) {
      return item;
    } else {
      remove(key);
    }
  }
}

/**
 * Writes an item to the cache
 * Will overwrite on key clash
 * @param key
 * @param item
 */
function set<T extends CacheItem>(key: string, item: T): void {
  memoryCache[key] = item;
}

function count(): number {
  return Object.keys(memoryCache).length;
}

function clear(): void {
  memoryCache = {};
}

export default { get, set, remove, count, clear };
