import {FileText, File, Truck, ClipboardCheck, Search, FileCheck} from "lucide-react";

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
    [DOCUMENT_TYPES.INVOICE]: 'bg-green-100 text-green-700 border-green-200',
    [DOCUMENT_TYPES.SHIPPING]: 'bg-orange-100 text-orange-700 border-orange-200',
    [DOCUMENT_TYPES.CUSTOMS]: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    [DOCUMENT_TYPES.INSPECTION]: 'bg-purple-100 text-purple-700 border-purple-200',
    [DOCUMENT_TYPES.REGISTRATION]: 'bg-teal-100 text-teal-700 border-teal-200',
    [DOCUMENT_TYPES.LC_DOCUMENT]: 'bg-blue-100 text-blue-700 border-blue-200',
    [DOCUMENT_TYPES.OTHER]: 'bg-gray-100 text-gray-700 border-gray-200',
};

const getAllDocumentTypes = () => Object.values(DOCUMENT_TYPES);

const getDocumentColor = (type) => {
    return colorMap[type] || colorMap['OTHER'];
};

const getDocumentIcon = (type) => {
    const iconMap = {
        [DOCUMENT_TYPES.LC_DOCUMENT]: FileText,
        [DOCUMENT_TYPES.INVOICE]: FileText,
        [DOCUMENT_TYPES.SHIPPING]: Truck,
        [DOCUMENT_TYPES.CUSTOMS]: ClipboardCheck,
        [DOCUMENT_TYPES.INSPECTION]: Search,
        [DOCUMENT_TYPES.REGISTRATION]: FileCheck,
        [DOCUMENT_TYPES.OTHER]: File,
    };
    const Icon = iconMap[type] || File;
    return <Icon className="w-5 h-5" />;
};

export {
    getAllDocumentTypes,
    getDocumentColor,
    getDocumentIcon
}