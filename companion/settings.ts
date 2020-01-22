import { settingsStorage } from "settings";

export interface SettingsItem<T> {
  name: T;
}

export function parseSetting<T>(
  value: string | null | undefined
): T | undefined {
  if (!value) {
    return undefined;
  }

  const item = JSON.parse(value) as SettingsItem<T>;
  return item.name;
}

export function getSetting<T>(key: string): T | undefined {
  const value = settingsStorage.getItem(key);
  return parseSetting<T>(value);
}

export function handleSettingChange<T>(
  evt: StorageChangeEvent,
  key: string,
  cb: (T) => void
): void {
  if (key !== evt.key) {
    return;
  }
  const item = parseSetting<T>(evt.newValue);
  if (item) {
    cb(item);
  }
}
