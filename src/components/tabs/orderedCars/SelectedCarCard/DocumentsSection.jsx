import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Upload, FileText, Download, Trash2, Eye, X, File } from 'lucide-react';
import { vehicleService } from '../../../../api/index.js';
import {getAllDocumentTypes, getDocumentColor, getDocumentIcon} from "../../../../utils/documetsUtil.jsx";
import PDFViewer from '../../../common/PDFViewer.jsx';

const DocumentsSection = ({ vehicleId, allDocuments, isEditing }) => {
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [documentType, setDocumentType] = useState('LC_DOCUMENT');
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });
    const [viewingPdf, setViewingPdf] = useState(null);

    const documents = Array.isArray(allDocuments) ? allDocuments : [];

    const showNotification = (type, message) => {
        setNotification({ show: true, type, message });
        setTimeout(() => {
            setNotification({ show: false, type: '', message: '' });
        }, 3000);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                showNotification('error', 'File size must be less than 10MB');
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            showNotification('error', 'Please select a file first');
            return;
        }

        try {
            setUploading(true);
            await vehicleService.uploadVehicleDocument(vehicleId, selectedFile, documentType, selectedFile.name);
            showNotification('success', 'Document uploaded successfully');
            setSelectedFile(null);
            setDocumentType('LC_DOCUMENT');
            // Reset file input
            document.getElementById('document-upload').value = '';
        } catch (error) {
            console.error('Upload failed:', error);
            showNotification('error', 'Failed to upload document');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (documentId) => {
        if (!confirm('Are you sure you want to delete this document?')) {
            return;
        }

        try {
            await vehicleService.deleteVehicleDocument(vehicleId, documentId);
            showNotification('success', 'Document deleted successfully');
        } catch (error) {
            console.error('Delete failed:', error);
            showNotification('error', 'Failed to delete document');
        }
    };

    const handleView = async (documentId, filename) => {
        try {
            const response = await vehicleService.getVehicleDocumentUrl(vehicleId, documentId);
            const url = response.data?.presigned_url || response.presigned_url;

            if (url) {
                setViewingPdf({ url, filename });
            } else {
                console.error('No URL found in response');
                showNotification('error', 'Failed to get document URL');
            }
        } catch (error) {
            console.error('View failed:', error);
            showNotification('error', 'Failed to view document');
        }
    };

    const handleDownload = async (documentId, filename) => {
        try {
            const response = await vehicleService.getVehicleDocumentUrl(vehicleId, documentId);
            const url = response.data?.presigned_url || response.presigned_url;

            if (url) {
                // Fetch the file as blob
                const fileResponse = await fetch(url);
                const blob = await fileResponse.blob();

                // Create blob URL and download
                const blobUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = filename || 'document.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Clean up
                window.URL.revokeObjectURL(blobUrl);
            } else {
                showNotification('error', 'Failed to get download URL');
            }
        } catch (error) {
            console.error('Download failed:', error);
            showNotification('error', 'Failed to download document');
        }
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return 'N/A';
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-4">
            {/* Notification */}
            {notification.show && (
                <div className={`p-3 rounded-lg border ${
                    notification.type === 'success'
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                    {notification.message}
                </div>
            )}

            {/* Upload Section - Only show in edit mode */}
            {isEditing && (
                <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Upload New Document</h4>

                    <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Document Type
                                </label>
                                <select
                                    value={documentType}
                                    onChange={(e) => setDocumentType(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {getAllDocumentTypes().map(docType => (
                                        <option key={docType} value={docType}>{docType}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Select File (Max 10MB)
                                </label>
                                <input
                                    id="document-upload"
                                    type="file"
                                    onChange={handleFileSelect}
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {selectedFile && (
                            <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                                <div className="flex items-center space-x-2">
                                    <FileText className="w-4 h-4 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                                        <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedFile(null);
                                        document.getElementById('document-upload').value = '';
                                    }}
                                    className="text-gray-400 hover:text-red-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleUpload}
                            disabled={!selectedFile || uploading}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Upload className="w-4 h-4" />
                            <span>{uploading ? 'Uploading...' : 'Upload Document'}</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Documents List */}
            <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Uploaded Documents ({documents.length})
                </h4>

                {documents.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2"/>
                        <p className="text-sm text-gray-600">No documents uploaded yet</p>
                        {!isEditing && (
                            <p className="text-xs text-gray-500 mt-1">Click Edit to upload documents</p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {documents.map((doc) => (
                            <div
                                key={doc.id}
                                className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
                            >
                                <div className="flex items-center space-x-3 flex-1">
                                    <div className={`p-2 rounded-lg border ${getDocumentColor(doc.document_type)}`}>
                                        {getDocumentIcon(doc.document_type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {doc.document_name || 'Document'}
                                        </p>
                                        <div className="flex items-center space-x-3 mt-1">
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded-full border ${getDocumentColor(doc.document_type)}`}>
                                                {doc.document_type.replace('_', ' ')}
                                            </span>
                                            {doc.file_size_bytes && (
                                                <span className="text-xs text-gray-500">
                                                    {formatFileSize(doc.file_size_bytes)}
                                                </span>
                                            )}
                                            <span className="text-xs text-gray-500">
                                                {formatDate(doc.upload_date || 'N/A')}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 ml-4">
                                    <button
                                        type="button"
                                        onClick={() => handleView(doc.id, doc.document_name)}
                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                        title="View"
                                    >
                                        <Eye className="w-4 h-4"/>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDownload(doc.id, doc.filename)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Download"
                                    >
                                        <Download className="w-4 h-4"/>
                                    </button>
                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(doc.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4"/>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* PDF Viewer - Rendered via Portal */}
            {viewingPdf && ReactDOM.createPortal(
                <>
                    <PDFViewer
                        pdfUrl={viewingPdf.url}
                        fileName={viewingPdf.filename}
                        onClose={() => setViewingPdf(null)}
                    />
                </>,
                document.body
            )}
        </div>
    );
};

export default DocumentsSection;
