/**
 * File system cache for fitbit device.
 * Will also cache in memory
 */
import * as fs from "fs";
import cache, { CacheItem } from "../common/cache";
import { isRecent } from "../common";

/**
 * Reads an item from the cache
 * @param key cache Key
 * @param ttl Number of seconds to cache the item for
 */
function get<T extends CacheItem>(key: string, ttl: number): T | undefined {
  const item = cache.get<T>(key, ttl);
  if (item) {
    return item;
  }

  if (fs.existsSync(key)) {
    const item = (fs.readFileSync(key, "cbor") as unknown) as T;

    if (isRecent(item.timestamp, ttl)) {
      cache.set<T>(key, item);
      return item;
    }

    fs.unlinkSync(key);
  }
}

/**
 * Writes an item to the cache
 * Will overwrite on key clash
 * @param key
 * @param item
 */
function set<T extends CacheItem>(key: string, item: T): void {
  cache.set<T>(key, item);
  fs.writeFileSync(key, item, "cbor");
}

export default { get, set };
