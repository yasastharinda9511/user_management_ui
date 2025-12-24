import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';

const ImageViewer = ({ images, initialIndex = 0, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        const handleArrowKeys = (e) => {
            if (e.key === 'ArrowLeft') {
                handlePrevious();
            } else if (e.key === 'ArrowRight') {
                handleNext();
            }
        };

        document.addEventListener('keydown', handleEscape);
        document.addEventListener('keydown', handleArrowKeys);

        // Prevent body scroll when viewer is open
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('keydown', handleArrowKeys);
            document.body.style.overflow = 'unset';
        };
    }, [onClose, currentIndex]);

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleDownload = async () => {
        try {
            const image = images[currentIndex];
            const response = await fetch(image);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `vehicle-image-${currentIndex + 1}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading image:', error);
        }
    };

    if (!images || images.length === 0) return null;

    return (
        <div
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-lg flex items-center justify-center"
            onClick={handleBackdropClick}
        >
            {/* Top Controls */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                {/* Download Button */}
                <button
                    onClick={handleDownload}
                    className="p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all shadow-lg backdrop-blur-sm"
                    title="Download Image"
                >
                    <Download className="w-6 h-6" />
                </button>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all shadow-lg"
                    title="Close (Esc)"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Image Counter */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium shadow-lg">
                {currentIndex + 1} / {images.length}
            </div>

            {/* Previous Button */}
            {images.length > 1 && (
                <button
                    onClick={handlePrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all z-10 shadow-lg backdrop-blur-sm"
                    title="Previous (←)"
                >
                    <ChevronLeft className="w-8 h-8" />
                </button>
            )}

            {/* Image */}
            <div className="relative max-w-[70vw] max-h-[70vh] flex items-center justify-center">
                <img
                    src={images[currentIndex]}
                    alt={`Image ${currentIndex + 1}`}
                    className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
                />
            </div>

            {/* Next Button */}
            {images.length > 1 && (
                <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all z-10 shadow-lg backdrop-blur-sm"
                    title="Next (→)"
                >
                    <ChevronRight className="w-8 h-8" />
                </button>
            )}

            {/* Thumbnail Strip */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 px-4 py-3 bg-white/20 backdrop-blur-md rounded-lg max-w-[90vw] overflow-x-auto shadow-lg">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                index === currentIndex
                                    ? 'border-white scale-110'
                                    : 'border-white/30 hover:border-white/60'
                            }`}
                        >
                            <img
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageViewer;
