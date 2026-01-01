import vehicleService from '../api/vehicleService.js';

/**
 * Presigned URL Cache Utility
 *
 * Provides caching for presigned URLs using sessionStorage with:
 * - 10-minute expiration (safe buffer before backend's 15-min expiry)
 * - Request deduplication to prevent duplicate API calls
 * - Smart invalidation on upload/delete operations
 */

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds
const CACHE_PREFIX = 'presigned_url';

// In-memory map to track pending requests for deduplication
const pendingRequests = new Map();

/**
 * Generate cache key for a resource
 */
const generateCacheKey = (resourceType, ...identifiers) => {
    return `${CACHE_PREFIX}:${resourceType}:${identifiers.join(':')}`;
};

/**
 * Get item from cache
 * Returns null if not found or expired
 */
const getFromCache = (key) => {
    try {
        const item = sessionStorage.getItem(key);
        if (!item) return null;

        const entry = JSON.parse(item);

        // Check if expired
        if (Date.now() > entry.expiresAt) {
            sessionStorage.removeItem(key);
            return null;
        }

        return entry.url;
    } catch (error) {
        console.error('Error reading from cache:', error);
        return null;
    }
};

/**
 * Store item in cache
 */
const storeInCache = (key, url, resourceType, metadata = {}) => {
    try {
        const now = Date.now();
        const entry = {
            url,
            timestamp: now,
            expiresAt: now + CACHE_DURATION,
            resourceType,
            metadata
        };

        sessionStorage.setItem(key, JSON.stringify(entry));
    } catch (error) {
        console.error('Error storing in cache:', error);

        // Handle quota exceeded - clear expired entries and retry
        if (error.name === 'QuotaExceededError') {
            clearExpiredEntries();
            try {
                sessionStorage.setItem(key, JSON.stringify({
                    url,
                    timestamp: Date.now(),
                    expiresAt: Date.now() + CACHE_DURATION,
                    resourceType,
                    metadata
                }));
            } catch (retryError) {
                console.error('Failed to store in cache after cleanup:', retryError);
            }
        }
    }
};

/**
 * Remove item from cache
 */
const removeFromCache = (key) => {
    try {
        sessionStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing from cache:', error);
    }
};

/**
 * Clear all expired entries from cache
 */
const clearExpiredEntries = () => {
    try {
        const now = Date.now();
        const keysToRemove = [];

        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (key && key.startsWith(CACHE_PREFIX)) {
                const item = sessionStorage.getItem(key);
                if (item) {
                    try {
                        const entry = JSON.parse(item);
                        if (now > entry.expiresAt) {
                            keysToRemove.push(key);
                        }
                    } catch (e) {
                        // Invalid entry, mark for removal
                        keysToRemove.push(key);
                    }
                }
            }
        }

        keysToRemove.forEach(key => sessionStorage.removeItem(key));
    } catch (error) {
        console.error('Error clearing expired entries:', error);
    }
};

/**
 * Generic fetch with caching and request deduplication
 */
const fetchWithCache = async (cacheKey, fetchFn, resourceType, metadata) => {
    // Check cache first
    const cachedUrl = getFromCache(cacheKey);
    if (cachedUrl) {
        return cachedUrl;
    }

    // Check if request is already in-flight
    if (pendingRequests.has(cacheKey)) {
        return pendingRequests.get(cacheKey);
    }

    // Make API call and cache the promise for deduplication
    const promise = fetchFn()
        .then(response => {
            const url = response.data.presigned_url;
            storeInCache(cacheKey, url, resourceType, metadata);
            pendingRequests.delete(cacheKey);
            return url;
        })
        .catch(error => {
            pendingRequests.delete(cacheKey);
            throw error;
        });

    pendingRequests.set(cacheKey, promise);
    return promise;
};

/**
 * Public API: Get cached vehicle image presigned URL
 */
export const getCachedVehicleImage = async (vehicleId, filename) => {
    const cacheKey = generateCacheKey('vehicle_image', vehicleId, filename);
    return fetchWithCache(
        cacheKey,
        () => vehicleService.getVehicleImagePresignedUrl(vehicleId, filename),
        'vehicle_image',
        { vehicleId, filename }
    );
};

/**
 * Public API: Get cached make logo presigned URL
 */
export const getCachedMakeLogo = async (makeId) => {
    const cacheKey = generateCacheKey('make_logo', makeId);
    return fetchWithCache(
        cacheKey,
        () => vehicleService.getMakeLogo(makeId),
        'make_logo',
        { makeId }
    );
};

/**
 * Public API: Get cached document presigned URL
 */
export const getCachedDocumentUrl = async (vehicleId, documentId) => {
    const cacheKey = generateCacheKey('document', vehicleId, documentId);
    return fetchWithCache(
        cacheKey,
        () => vehicleService.getVehicleDocumentUrl(vehicleId, documentId),
        'document',
        { vehicleId, documentId }
    );
};

/**
 * Invalidation: Remove all vehicle images for a specific vehicle
 */
export const invalidateVehicleImages = (vehicleId) => {
    try {
        const pattern = `${CACHE_PREFIX}:vehicle_image:${vehicleId}:`;
        const keysToRemove = [];

        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (key && key.startsWith(pattern)) {
                keysToRemove.push(key);
            }
        }

        keysToRemove.forEach(key => sessionStorage.removeItem(key));
    } catch (error) {
        console.error('Error invalidating vehicle images:', error);
    }
};

/**
 * Invalidation: Remove make logo
 */
export const invalidateMakeLogo = (makeId) => {
    const cacheKey = generateCacheKey('make_logo', makeId);
    removeFromCache(cacheKey);
};

/**
 * Invalidation: Remove specific document
 */
export const invalidateDocument = (vehicleId, documentId) => {
    const cacheKey = generateCacheKey('document', vehicleId, documentId);
    removeFromCache(cacheKey);
};

/**
 * Invalidation: Remove all documents for a specific vehicle
 */
export const invalidateVehicleDocuments = (vehicleId) => {
    try {
        const pattern = `${CACHE_PREFIX}:document:${vehicleId}:`;
        const keysToRemove = [];

        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (key && key.startsWith(pattern)) {
                keysToRemove.push(key);
            }
        }

        keysToRemove.forEach(key => sessionStorage.removeItem(key));
    } catch (error) {
        console.error('Error invalidating vehicle documents:', error);
    }
};

/**
 * Clear all presigned URL cache entries
 */
export const clearAllCache = () => {
    try {
        const keysToRemove = [];

        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (key && key.startsWith(CACHE_PREFIX)) {
                keysToRemove.push(key);
            }
        }

        keysToRemove.forEach(key => sessionStorage.removeItem(key));
        pendingRequests.clear();
    } catch (error) {
        console.error('Error clearing all cache:', error);
    }
};

// Export as default object for easier imports
const presignedUrlCache = {
    getCachedVehicleImage,
    getCachedMakeLogo,
    getCachedDocumentUrl,
    invalidateVehicleImages,
    invalidateMakeLogo,
    invalidateDocument,
    invalidateVehicleDocuments,
    clearAllCache,
    clearExpiredEntries
};

export default presignedUrlCache;
