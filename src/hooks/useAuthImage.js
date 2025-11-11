import { useState, useEffect } from 'react';
import { carServiceApi } from '../api/axiosClient';

/**
 * Custom hook to fetch images that require authentication
 * @param {string} imageUrl - The image URL to fetch
 * @returns {string|null} - Object URL for the image blob, or null if loading/error
 */
const useAuthImage = (imageUrl) => {
    const [blobUrl, setBlobUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!imageUrl) {
            setLoading(false);
            return;
        }

        let objectUrl = null;

        const fetchImage = async () => {
            try {
                setLoading(true);
                setError(null);

                // Extract the path from the full URL if needed
                const path = imageUrl.replace(carServiceApi.defaults.baseURL, '');

                // Fetch image as blob with auth headers
                const response = await carServiceApi.get(path, {
                    responseType: 'blob'
                });

                // Create object URL from blob
                objectUrl = URL.createObjectURL(response.data);
                setBlobUrl(objectUrl);
            } catch (err) {
                console.error('Failed to fetch image:', err);
                setError(err);
                setBlobUrl(null);
            } finally {
                setLoading(false);
            }
        };

        fetchImage();

        // Cleanup: revoke object URL when component unmounts or URL changes
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [imageUrl]);

    return { blobUrl, loading, error };
};

export default useAuthImage;
