

export const SELECTED_VEHICLE_CARD_OPTIONS = {
    VEHICLE_INFORMATION:"Vehicle Information",
    SHIPPING_DETAILS:"Shipping Details",
    PURCHASE_DETAILS:"Purchase Details",
    FINANCIAL_SUMMARY:"Financial Summary",
    SALES_INFORMATION:"Sales Information",
    DOCUMENTS:"Documents & Attachments",
}

export const SHIPPING_STATUS = {
    CLEARED:"CLEARED",
    SHIPPED:"SHIPPED",
    NOT_SHIPPED:"NOT_SHIPPED",
    ARRIVED:"ARRIVED",
    PROCESSING:"PROCESSING",
    DELIVERED: "DELIVERED"
}

export const LOCAL_STORAGE_KEYS = {
    ACCESS_TOKEN:"access_token",
    USER_INFO :"user_info",
}

export const shippingStatusColors = {
    'ARRIVED': '#3b82f6',
    'CLEARED': '#10b981',
    'DELIVERED': '#22c55e',
    'PROCESSING': '#f59e0b',
    'SHIPPED': '#8b5cf6'
}

export const financialStatusColors = {
    'total_charges': '#3b82f6',
    'total_tt': '#10b981',
    'total_duty': '#22c55e',
    'total_clearing': '#f59e0b',
    'total_other_expenses': '#8b5cf6',
    "total_investment": "#ef4444",

}

export const vehicleBrandDataColors = {
    "Toyota": '#8b5cf6',
    "Honda": "#3b82f6",
    "Nissan": "#10b981",
    "Suzuki": "#f59e0b",
    "Others": "#8b5cf6"
}
export const vehicleSalesDataColors = {
    "SOLD": '#8b5cf6',
    "AVAILABLE": "#3b82f6",
}