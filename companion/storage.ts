import { localStorage } from "local-storage";
import { CacheItem } from "../common/cache";
import { isRecent } from "../common";

/** Remove item from storage */
function remove(key: string): void {
  localStorage.removeItem(key);
}

/**
 * Get an object from local-storage, if it exists and is recent
 * @param key
 * @param ttl Number of seconds to cache the item for
 */
function get<T extends CacheItem>(key: string, ttl: number): T | undefined {
  const rawValue = localStorage.getItem(key);

  if (rawValue) {
    const value = JSON.parse(rawValue) as T;
    if (isRecent(value.timestamp, ttl)) {
      return value;
    } else {
      remove(key);
    }
  }
}

/**
 * Save (add or replace) an object to local-storage.
 * Item is json encoded in storage
 * @param key
 * @param value
 */
function set<T extends CacheItem>(key: string, value: T): void {
  const rawValue = JSON.stringify(value);
  localStorage.setItem(key, rawValue);
}

/**
 * Get item. If it is missing or stale, then get new item and store it
 * @param key
 * @param ttl
 * @param getNewAsync async callback to get new item
 */
async function getOrAddAsync<T extends CacheItem>(
  key: string,
  ttl: number,
  getNewAsync: () => Promise<T>
): Promise<T> {
  let item = get<T>(key, ttl);
  if (item) {
    return item;
  }

  item = await getNewAsync();
  set<T>(key, item);
  return item;
}

export default { get, set, remove, getOrAddAsync };
