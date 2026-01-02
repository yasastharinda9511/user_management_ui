import {useState, useRef, useEffect} from "react";
import { Share2, Facebook, MessageCircle, Twitter, Linkedin, Link, Check } from 'lucide-react';
import {shareService} from "../../api/index.js";
import config from "../../configs/config.json";
import Portal from "./Portal.jsx";

const ShareButton = ({ vehicleId, vehicleData, variant = 'button', onShareComplete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [shareUrl, setShareUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const buttonRef = useRef(null);

    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + 8,
                left: rect.right - 224 // 224px = w-56 (14rem * 16px)
            });
        }
    }, [isOpen]);

    const generateShareLink = async () => {
        if (shareUrl) return shareUrl;

        setLoading(true);
        try {
            const response = await shareService.generateShareToken({vehicleId});
            const url = `${config.hosting_url.base_url}/share/${response.token}`;
            setShareUrl(url);
            onShareComplete?.(response.data.token);
            console.log(url);
            return url;
        } catch (error) {
            console.error('Failed to generate share link:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleShare = async (platform) => {
        const url = await generateShareLink();
        if (!url) return;

        const shareText = `Check out this ${vehicleData.vehicle.make} ${vehicleData.vehicle.model} (${vehicleData.vehicle.year_of_manufacture})`;

        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + url)}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        };

        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        setIsOpen(false);
    };

    const copyToClipboard = async () => {
        const url = await generateShareLink();
        if (!url) return;

        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className={variant === 'icon'
                    ? "p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    : "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                }
            >
                <Share2 className="w-4 h-4" />
                {variant === 'button' && <span>Share</span>}
            </button>

            {isOpen && (
                <Portal>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div
                        className="fixed w-56 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50"
                        style={{
                            top: `${dropdownPosition.top}px`,
                            left: `${dropdownPosition.left}px`
                        }}
                    >
                        <div className="space-y-1">
                            <button
                                onClick={() => handleShare('facebook')}
                                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                                disabled={loading}
                            >
                                <Facebook className="w-5 h-5 text-blue-600" />
                                <span>Facebook</span>
                            </button>
                            <button
                                onClick={() => handleShare('whatsapp')}
                                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                                disabled={loading}
                            >
                                <MessageCircle className="w-5 h-5 text-green-600" />
                                <span>WhatsApp</span>
                            </button>
                            <button
                                onClick={() => handleShare('twitter')}
                                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                                disabled={loading}
                            >
                                <Twitter className="w-5 h-5 text-blue-400" />
                                <span>Twitter</span>
                            </button>
                            <button
                                onClick={() => handleShare('linkedin')}
                                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                                disabled={loading}
                            >
                                <Linkedin className="w-5 h-5 text-blue-700" />
                                <span>LinkedIn</span>
                            </button>
                            <div className="border-t border-gray-200 my-1" />
                            <button
                                onClick={copyToClipboard}
                                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                                disabled={loading}
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-5 h-5 text-green-600" />
                                        <span>Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Link className="w-5 h-5 text-gray-600" />
                                        <span>Copy Link</span>
                                    </>
                                )}
                            </button>
                        </div>
                        {loading && (
                            <div className="text-center text-sm text-gray-500 mt-2">
                                Generating link...
                            </div>
                        )}
                    </div>
                </Portal>
            )}
        </>
    );
};

export default ShareButton;