import React, { useState, useRef, useEffect } from 'react';
import { Edit2, Trash2, Car, Upload, Image as ImageIcon, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { vehicleService } from '../../../api/index.js';

const MakeCard = ({ make, onEdit, onDelete, onLogoUploaded }) => {
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [logoUrl, setLogoUrl] = useState(null);
    const [loadingLogo, setLoadingLogo] = useState(false);
    const [logoError, setLogoError] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (make.logo_url) {
            fetchLogoUrl();
        }
    }, [make.id, make.logo_url]);

    const fetchLogoUrl = async () => {
        try {
            setLoadingLogo(true);
            setLogoError(false);
            const response = await vehicleService.getMakeLogo(make.id);
            setLogoUrl(response.data.presigned_url);
        } catch (error) {
            console.error(`Error fetching logo for make ${make.id}:`, error);
            setLogoError(true);
        } finally {
            setLoadingLogo(false);
        }
    };

    const handleLogoUpload = async (file) => {
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size must be less than 5MB');
            return;
        }

        try {
            setUploadingLogo(true);
            await vehicleService.uploadMakeLogo(make.id, file);
            // Fetch the new presigned URL after upload
            await fetchLogoUrl();
            onLogoUploaded?.(make.id);
        } catch (error) {
            console.error('Error uploading logo:', error);
            alert('Failed to upload logo: ' + error.message);
        } finally {
            setUploadingLogo(false);
        }
    };

    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            handleLogoUpload(file);
        }
        // Reset input to allow uploading the same file again
        event.target.value = '';
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleImageError = () => {
        setLogoError(true);
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden">
            {/* Logo Section */}
            <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                {loadingLogo ? (
                    <RefreshCw className="w-12 h-12 text-gray-400 animate-spin" />
                ) : logoUrl && !logoError ? (
                    <img
                        src={logoUrl}
                        alt={`${make.make_name} logo`}
                        className="max-h-32 max-w-[80%] object-contain"
                        onError={handleImageError}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center">
                        <ImageIcon className="w-16 h-16 text-gray-300 mb-2" />
                        <p className="text-sm text-gray-400">No logo</p>
                    </div>
                )}

                {/* Upload button overlay */}
                <button
                    onClick={triggerFileInput}
                    disabled={uploadingLogo}
                    className="absolute bottom-2 right-2 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                    title="Upload logo"
                >
                    {uploadingLogo ? (
                        <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                    ) : (
                        <Upload className="w-4 h-4 text-gray-600" />
                    )}
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    accept="image/*"
                    className="hidden"
                />
            </div>

            {/* Content Section */}
            <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {make.make_name}
                        </h3>
                        {make.country_origin && (
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                <span>🌍</span>
                                {make.country_origin}
                            </p>
                        )}
                    </div>
                    {make.is_active !== undefined && (
                        <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                make.is_active
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                            }`}
                        >
                            {make.is_active ? (
                                <>
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Active
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-3 h-3 mr-1" />
                                    Inactive
                                </>
                            )}
                        </span>
                    )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                        <Car className="w-4 h-4" />
                        <span>{make.models?.length || 0} models</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button
                        onClick={() => onEdit(make)}
                        className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                    >
                        <Edit2 className="w-4 h-4" />
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(make)}
                        className="flex-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MakeCard;
