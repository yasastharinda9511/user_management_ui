import {FileText} from "lucide-react";

const DOCUMENT_TYPES = {
    INVOICE: "INVOICE",
    SHIPPING: "SHIPPING",
    CUSTOMS: "CUSTOMS",
    INSPECTION: "INSPECTION",
    REGISTRATION: "REGISTRATION",
    LC_DOCUMENT: "LC_DOCUMENT",
    OTHER: "OTHER",
};

const colorMap = {
    'LC_DOCUMENT': 'bg-blue-100 text-blue-700 border-blue-200',
    'INVOICE': 'bg-green-100 text-green-700 border-green-200',
    'RECEIPT': 'bg-purple-100 text-purple-700 border-purple-200',
    'CONTRACT': 'bg-orange-100 text-orange-700 border-orange-200',
    'OTHER': 'bg-gray-100 text-gray-700 border-gray-200'
};

const getAllDocumentTypes = () => Object.values(DOCUMENT_TYPES);

const getDocumentColor = (type) => {
    return colorMap[type] || colorMap['OTHER'];
};

const getDocumentIcon = (type) => {
    const iconMap = {
        'LC_DOCUMENT': FileText,
        'INVOICE': FileText,
        'RECEIPT': FileText,
        'CONTRACT': FileText,
        'OTHER': File
    };
    const Icon = iconMap[type] || File;
    return <Icon className="w-5 h-5" />;
};

export {
    getAllDocumentTypes,
    getDocumentColor,
    getDocumentIcon
}