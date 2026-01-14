// Settings Service - Centralized settings management with localStorage

const SETTINGS_KEY = 'app_settings';

// Default settings
const DEFAULT_SETTINGS = {
  defaultViewMode: 'grid',           // 'grid' or 'list'
  darkMode: false,                   // true/false
  defaultItemsPerPage: 10,          // 10, 20, 50, 100
  emailNotifications: true          // true/false
};

/**
 * Get all settings from localStorage
 * Returns default settings if none exist
 */
const getSettings = () => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to ensure all keys exist
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
    return { ...DEFAULT_SETTINGS };
  } catch (error) {
    console.error('Error loading settings:', error);
    return { ...DEFAULT_SETTINGS };
  }
};

/**
 * Get a single setting value by key
 * @param {string} key - Setting key to retrieve
 * @returns {any} Setting value or default
 */
const getSetting = (key) => {
  const settings = getSettings();
  return settings[key] !== undefined ? settings[key] : DEFAULT_SETTINGS[key];
};

/**
 * Update a single setting
 * @param {string} key - Setting key to update
 * @param {any} value - New value for the setting
 */
const setSetting = (key, value) => {
  try {
    const settings = getSettings();
    settings[key] = value;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving setting:', error);
    return false;
  }
};

/**
 * Update multiple settings at once
 * @param {object} newSettings - Object with settings to update
 */
const setSettings = (newSettings) => {
  try {
    const settings = getSettings();
    const updated = { ...settings, ...newSettings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};

/**
 * Reset all settings to defaults
 */
const resetSettings = () => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
    return true;
  } catch (error) {
    console.error('Error resetting settings:', error);
    return false;
  }
};

/**
 * Check if a setting exists
 * @param {string} key - Setting key to check
 * @returns {boolean}
 */
const hasSetting = (key) => {
  return DEFAULT_SETTINGS.hasOwnProperty(key);
};

// Export all functions
const settingsService = {
  getSettings,
  getSetting,
  setSetting,
  setSettings,
  resetSettings,
  hasSetting,
  DEFAULT_SETTINGS
};

export default settingsService;
