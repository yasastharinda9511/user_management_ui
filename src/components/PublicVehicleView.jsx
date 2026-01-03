import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {shareService, vehicleService} from '../api/index.js';
import { Car, Calendar, Palette, Gauge, Phone, Mail, FileText, Award, Hash, ChevronLeft, ChevronRight } from 'lucide-react';
import LoadingOverlay from './common/LoadingOverlay.jsx';

const PublicVehicleView = () => {
    const { shareToken } = useParams();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    useEffect(() => {
        console.log(shareToken);
        fetchPublicVehicle();
    }, [shareToken]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (vehicle?.images?.length > 1) {
                if (e.key === 'ArrowLeft') {
                    handlePreviousImage();
                } else if (e.key === 'ArrowRight') {
                    handleNextImage();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [vehicle, currentImageIndex]);

    const fetchPublicVehicle = async () => {
        try {
            setLoading(true);
            const response = await shareService.getPublicVehicleData({shareToken});
            setVehicle(response);
            setCurrentImageIndex(0);
        } catch (error) {
            setError(error.message || 'Failed to load vehicle');
        } finally {
            setLoading(false);
        }
    };

    const handlePreviousImage = () => {
        if (vehicle?.images?.length > 0) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? vehicle.images.length - 1 : prev - 1
            );
        }
    };

    const handleNextImage = () => {
        if (vehicle?.images?.length > 0) {
            setCurrentImageIndex((prev) =>
                prev === vehicle.images.length - 1 ? 0 : prev + 1
            );
        }
    };

    const handleThumbnailClick = (index) => {
        setCurrentImageIndex(index);
    };

    // Touch swipe handlers
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            handleNextImage();
        } else if (isRightSwipe) {
            handlePreviousImage();
        }
    };

    if (loading) {
        return (
            <div className="relative min-h-screen">
                <LoadingOverlay message="Loading vehicle details..." icon={Car} />
            </div>
        );
    }

    if (error || !vehicle) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Vehicle Not Found</h2>
                    <p className="text-gray-600">{error || 'This share link may have expired or is invalid.'}</p>
                </div>
            </div>
        );
    }

    const metaTitle = `${vehicle.year_of_manufacture} ${vehicle.make} ${vehicle.model}`;
    const metaDescription = `${vehicle.condition_status} • ${vehicle.mileage_km.toLocaleString()} km • ${vehicle.color}${vehicle.trim_level ? ` • ${vehicle.trim_level}` : ''}`;
    const metaImage = vehicle.images?.[0]?.image_url || '';
    const currentUrl = window.location.href;

    return (
        <>
            <Helmet>
                <title>{metaTitle} - Tarragon.lk</title>
                <meta name="description" content={metaDescription} />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content={currentUrl} />
                <meta property="og:title" content={metaTitle} />
                <meta property="og:description" content={metaDescription} />
                <meta property="og:site_name" content="Tarragon.lk" />

                {metaImage && (
                    <>
                        <meta property="og:image" content={metaImage} />
                        <meta property="og:image:secure_url" content={metaImage} />
                        <meta property="og:image:type" content="image/jpeg" />
                        <meta property="og:image:width" content="1200" />
                        <meta property="og:image:height" content="630" />
                        <meta property="og:image:alt" content={metaTitle} />
                    </>
                )}

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={metaTitle} />
                <meta name="twitter:description" content={metaDescription} />
                {metaImage && <meta name="twitter:image" content={metaImage} />}
            </Helmet>

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 py-6">
                        <div className="flex items-center gap-3">
                            <img
                                src="/tarragon.jpg"
                                alt="Tarragon.lk Logo"
                                className="w-12 h-12 rounded-lg object-cover"
                            />
                            <h1 className="text-2xl font-bold text-gray-900">Tarragon.lk</h1>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        {/* Image Gallery */}
                        <div
                            className="relative h-96 bg-gray-900 group"
                            onTouchStart={onTouchStart}
                            onTouchMove={onTouchMove}
                            onTouchEnd={onTouchEnd}
                        >
                            {vehicle.images?.length > 0 ? (
                                <>
                                    <img
                                        src={vehicle.images[currentImageIndex].image_url}
                                        alt={`${vehicle.make} ${vehicle.model} - Image ${currentImageIndex + 1}`}
                                        className="w-full h-full object-contain select-none"
                                    />

                                    {/* Navigation Arrows */}
                                    {vehicle.images.length > 1 && (
                                        <>
                                            <button
                                                onClick={handlePreviousImage}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                aria-label="Previous image"
                                            >
                                                <ChevronLeft className="w-6 h-6 text-gray-700" />
                                            </button>
                                            <button
                                                onClick={handleNextImage}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                aria-label="Next image"
                                            >
                                                <ChevronRight className="w-6 h-6 text-gray-700" />
                                            </button>

                                            {/* Image Counter */}
                                            <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/70 text-white text-sm rounded-full font-medium">
                                                {currentImageIndex + 1} / {vehicle.images.length}
                                            </div>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <Car className="w-24 h-24 text-gray-600" />
                                </div>
                            )}
                            {vehicle.is_featured && (
                                <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                    Featured
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {vehicle.images?.length > 1 && (
                            <div className="bg-gray-100 p-4 border-t border-gray-200">
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {vehicle.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleThumbnailClick(index)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                                currentImageIndex === index
                                                    ? 'border-blue-600 ring-2 ring-blue-200'
                                                    : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                        >
                                            <img
                                                src={image.image_url}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Vehicle Details */}
                        <div className="p-6">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                {vehicle.year_of_manufacture} {vehicle.make} {vehicle.model}
                            </h2>
                            {vehicle.trim_level && (
                                <p className="text-lg text-gray-600 mb-2">Trim: {vehicle.trim_level}</p>
                            )}
                            {vehicle.code && (
                                <p className="text-sm text-gray-500 mb-6">Vehicle Code: {vehicle.code}</p>
                            )}

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Year</p>
                                        <p className="font-semibold">{vehicle.year_of_manufacture}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Gauge className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Mileage</p>
                                        <p className="font-semibold">{vehicle.mileage_km.toLocaleString()} km</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Palette className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Color</p>
                                        <p className="font-semibold">{vehicle.color}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Car className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Condition</p>
                                        <p className="font-semibold">{vehicle.condition_status}</p>
                                    </div>
                                </div>
                                {vehicle.chassis_id && (
                                    <div className="flex items-center gap-3">
                                        <Hash className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">Chassis ID</p>
                                            <p className="font-semibold text-xs">{vehicle.chassis_id}</p>
                                        </div>
                                    </div>
                                )}
                                {vehicle.auction_grade && (
                                    <div className="flex items-center gap-3">
                                        <Award className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">Auction Grade</p>
                                            <p className="font-semibold">{vehicle.auction_grade}</p>
                                        </div>
                                    </div>
                                )}
                                {vehicle.currency && (
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">Currency</p>
                                            <p className="font-semibold">{vehicle.currency}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Call to Action */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Interested in this vehicle?</h3>
                                <p className="text-gray-600 mb-4">Contact us for more information and to schedule a viewing.</p>
                                <div className="flex gap-4">
                                    <a
                                        href="tel:+94123456789"
                                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <Phone className="w-5 h-5" />
                                        Call Us
                                    </a>
                                    <a
                                        href="mailto:info@carservice.com"
                                        className="flex items-center gap-2 px-6 py-3 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                    >
                                        <Mail className="w-5 h-5" />
                                        Email Us
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PublicVehicleView;