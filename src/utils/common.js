

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

export {
    formatCurrency,
    formatDate,
}