import {SHIPPING_STATUS} from "../common/Costants.js";


export const getStatusColor = (status) => {
    const statusColors = {
        [SHIPPING_STATUS.ARRIVED]: 'bg-green-100 text-green-800 border-green-200',
        [SHIPPING_STATUS.SHIPPED]: 'bg-blue-100 text-blue-800 border-blue-200',
        [SHIPPING_STATUS.CLEARED]: 'bg-purple-100 text-purple-800 border-purple-200',
        [SHIPPING_STATUS.ARRIVED]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        [SHIPPING_STATUS.PROCESSING]: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};