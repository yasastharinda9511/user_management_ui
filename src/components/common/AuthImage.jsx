import React from 'react';
import useAuthImage from '../../hooks/useAuthImage';

/**
 * Image component that handles authentication for protected image endpoints
 * Falls back to placeholder if image fails to load
 */
const AuthImage = ({
    src,
    alt,
    className,
    fallbackText = 'No Image',
    onError,
    ...props
}) => {
    const { blobUrl, loading, error } = useAuthImage(src);

    // Generate placeholder URL
    const getPlaceholderUrl = () => {
        return `https://via.placeholder.com/400x250/f3f4f6/6b7280?text=${encodeURIComponent(fallbackText)}`;
    };

    if (loading) {
        return (
            <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
                <div className="animate-pulse text-gray-400">Loading...</div>
            </div>
        );
    }

    if (error || !blobUrl) {
        return (
            <img
                src={getPlaceholderUrl()}
                alt={alt}
                className={className}
                {...props}
            />
        );
    }

    return (
        <img
            src={blobUrl}
            alt={alt}
            className={className}
            onError={(e) => {
                e.target.src = getPlaceholderUrl();
                if (onError) onError(e);
            }}
            {...props}
        />
    );
};

export default AuthImage;
