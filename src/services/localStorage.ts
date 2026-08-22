const PREFIX = 'civicfix_';

export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    console.warn('Failed to save to localStorage');
  }
}

export function removeStorageItem(key: string): void {
  localStorage.removeItem(PREFIX + key);
}
