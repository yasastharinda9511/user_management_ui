import React from 'react';
import { X, Download, ZoomIn, ZoomOut } from 'lucide-react';

const PDFViewer = ({ pdfUrl, fileName, onClose }) => {
    const handleDownload = async () => {
        try {
            const response = await fetch(pdfUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName || 'document.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading PDF:', error);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-lg flex items-center justify-center p-4">
            {/* Header Controls */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-3 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full shadow-lg z-10">
                <span className="text-white font-medium text-sm">{fileName || 'Document.pdf'}</span>
            </div>

            {/* Top Right Controls */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                {/* Download Button */}
                <button
                    onClick={handleDownload}
                    className="p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all shadow-lg backdrop-blur-sm"
                    title="Download PDF"
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

            {/* PDF Viewer */}
            <div className="relative w-full max-w-6xl h-[85vh] bg-white rounded-lg shadow-2xl overflow-hidden">
                <iframe
                    src={pdfUrl}
                    className="w-full h-full"
                    title="PDF Viewer"
                    frameBorder="0"
                />
            </div>
        </div>
    );
};

export default PDFViewer;
