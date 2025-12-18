
/**
 * Safely retrieves an item from localStorage.
 * Returns null if the item doesn't exist or if an error occurs.
 */
export const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error retrieving key "${key}" from localStorage:`, error);
    return defaultValue;
  }
};

/**
 * Safely sets an item in localStorage.
 * Catches QuotaExceededError and other storage errors.
 */
export const setStorageItem = <T>(key: string, value: T): boolean => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    if (error instanceof DOMException && 
        (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
      console.error("LocalStorage quota exceeded. Unable to save progress.");
      // In a real app, you might trigger a cleanup routine here
    } else {
      console.error(`Error saving key "${key}" to localStorage:`, error);
    }
    return false;
  }
};

/**
 * Safely removes an item from localStorage.
 */
export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing key "${key}" from localStorage:`, error);
  }
};
