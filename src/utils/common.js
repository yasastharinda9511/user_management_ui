

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

/**
 * Format a number with commas (thousands separators)
 * @param {string|number} value - The number to format
 * @param {boolean} allowDecimals - Whether to allow decimal points (default: true)
 * @returns {string} - Formatted number with commas
 */
const formatNumberWithCommas = (value, allowDecimals = true) => {
    if (!value && value !== 0) return '';

    // Convert to string and remove any existing commas
    let stringValue = value.toString().replace(/,/g, '');

    // Handle decimals
    let parts = stringValue.split('.');
    let integerPart = parts[0];
    let decimalPart = parts[1];

    // Remove non-numeric characters from integer part
    integerPart = integerPart.replace(/\D/g, '');

    // Add commas to integer part
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Reconstruct the number
    if (allowDecimals && decimalPart !== undefined) {
        // Remove non-numeric characters from decimal part
        decimalPart = decimalPart.replace(/\D/g, '');
        return integerPart + '.' + decimalPart;
    }

    return integerPart;
};

/**
 * Remove commas from a formatted number string
 * @param {string} value - The formatted number string
 * @returns {string} - Number without commas
 */
const removeCommas = (value) => {
    if (!value) return '';
    return value.toString().replace(/,/g, '');
};

/**
 * Parse a formatted number string to a float
 * @param {string} value - The formatted number string
 * @returns {number|null} - Parsed number or null if invalid
 */
const parseFormattedNumber = (value) => {
    if (!value) return null;
    const cleaned = removeCommas(value);
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? null : parsed;
};

/**
 * Handle input change for number fields with comma formatting
 * @param {Event} e - The input event
 * @param {Function} setter - State setter function
 * @param {boolean} allowDecimals - Whether to allow decimal points
 */
const handleNumberInputChange = (e, setter, allowDecimals = true) => {
    const rawValue = e.target.value;
    const formatted = formatNumberWithCommas(rawValue, allowDecimals);
    setter(formatted);
};

export {
    formatCurrency,
    formatDate,
    convertToRFC3339,
    formatNumberWithCommas,
    removeCommas,
    parseFormattedNumber,
    handleNumberInputChange
}