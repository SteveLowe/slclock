import { localStorage } from "local-storage";

/**
 * Get an object from local-storage
 * @param key
 */
export function getItem<T>(key: string): T | null {
  const rawValue = localStorage.getItem(key);
  if (!rawValue) {
    return null;
  }

  const value = JSON.parse(rawValue) as T;
  return value;
}

/**
 * Save (add or replace) an object to local-storage.
 * Item is json encoded in storage
 * @param key
 * @param value
 */
export function setItem<T>(key: string, value: T): void {
  const rawValue = JSON.stringify(value);
  localStorage.setItem(key, rawValue);
}
