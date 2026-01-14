import React, { useState, useEffect } from 'react';
import { LayoutGrid, List, RotateCcw } from 'lucide-react';
import settingsService from '../../../utils/settingsService';
import {  useNotification} from '../../../contexts/NotificationContext';

const Settings = () => {
    const { showNotification } = useNotification();

    // Load settings from localStorage
    const [settings, setSettings] = useState({
        defaultViewMode: 'grid',
        darkMode: false,
        defaultItemsPerPage: 10,
        emailNotifications: true
    });

    // Load settings on mount
    useEffect(() => {
        const loadedSettings = settingsService.getSettings();
        setSettings(loadedSettings);
    }, []);

    // Handle default view mode change
    const handleViewModeChange = (mode) => {
        setSettings(prev => ({ ...prev, defaultViewMode: mode }));
        settingsService.setSetting('defaultViewMode', mode);
        showNotification(`Default view mode set to ${mode}`, 'success');
    };

    // Handle dark mode toggle
    const handleDarkModeToggle = (e) => {
        const enabled = e.target.checked;
        setSettings(prev => ({ ...prev, darkMode: enabled }));
        settingsService.setSetting('darkMode', enabled);

        // Apply/remove dark class to document
        if (enabled) {
            document.documentElement.classList.add('dark');
            showNotification('Dark mode enabled', 'success');
        } else {
            document.documentElement.classList.remove('dark');
            showNotification('Dark mode disabled', 'success');
        }
    };

    // Handle items per page change
    const handleItemsPerPageChange = (e) => {
        const value = Number(e.target.value);
        setSettings(prev => ({ ...prev, defaultItemsPerPage: value }));
        settingsService.setSetting('defaultItemsPerPage', value);
        showNotification(`Default items per page set to ${value}`, 'success');
    };

    // Handle email notifications toggle
    const handleEmailNotificationsToggle = (e) => {
        const enabled = e.target.checked;
        setSettings(prev => ({ ...prev, emailNotifications: enabled }));
        settingsService.setSetting('emailNotifications', enabled);
        showNotification(
            enabled ? 'Email notifications enabled' : 'Email notifications disabled',
            'success'
        );
    };

    // Handle reset settings
    const handleResetSettings = () => {
        settingsService.resetSettings();
        const defaultSettings = settingsService.getSettings();
        setSettings(defaultSettings);

        // Apply dark mode change
        if (defaultSettings.darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        showNotification('Settings reset to defaults', 'success');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Configure your preferences.</p>
            </div>

            {/* View Preferences Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">View Preferences</h3>
                <div className="space-y-6">
                    {/* Default View Mode */}
                    <div>
                        <div className="mb-3">
                            <p className="font-medium text-gray-900 dark:text-white">Default View Mode</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Choose how data tables and lists are displayed by default
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleViewModeChange('grid')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                                    settings.defaultViewMode === 'grid'
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500'
                                }`}
                            >
                                <LayoutGrid size={20} />
                                <span>Grid</span>
                            </button>
                            <button
                                onClick={() => handleViewModeChange('list')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                                    settings.defaultViewMode === 'list'
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500'
                                }`}
                            >
                                <List size={20} />
                                <span>List</span>
                            </button>
                        </div>
                    </div>

                    {/* Default Items Per Page */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">Default Items Per Page</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Number of items to show per page in paginated tables
                            </p>
                        </div>
                        <select
                            value={settings.defaultItemsPerPage}
                            onChange={handleItemsPerPageChange}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Appearance Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance</h3>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Toggle dark mode theme</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={settings.darkMode}
                            onChange={handleDarkModeToggle}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>

            {/* Notifications Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notifications</h3>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Receive email updates and notifications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={settings.emailNotifications}
                            onChange={handleEmailNotificationsToggle}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>

            {/* Reset Settings Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reset</h3>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">Reset All Settings</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Restore all settings to their default values
                        </p>
                    </div>
                    <button
                        onClick={handleResetSettings}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                        <RotateCcw size={18} />
                        <span>Reset to Defaults</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
