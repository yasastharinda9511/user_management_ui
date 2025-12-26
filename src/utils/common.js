

const formatCurrency = (amount, currency = 'LKR') => {
    if (!amount) return 'N/A';
    return `${currency} ${amount.toLocaleString()}`;
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        return 'Invalid Date';
    }
};

const convertToRFC3339 = (dateString) => {
    if (!dateString || dateString === 'N/A' || dateString.trim() === '') return null;

    if (dateString.includes('T')) return dateString;

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date.toISOString();
};

export {
    formatCurrency,
    formatDate,
    convertToRFC3339
}