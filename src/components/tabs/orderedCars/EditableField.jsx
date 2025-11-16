import React, { useState, useEffect } from 'react';

const EditableField = React.memo(({ label, value, section, field, type = "text", options = null, isEditing, currentValue, updateField }) => {
    const [inputValue, setInputValue] = useState(currentValue?.toString() || '');

    useEffect(() => {
        setInputValue(currentValue?.toString() || '');
    }, [currentValue]);

    if (!isEditing) {
        if (type === "currency") {
            return (
                <div className="flex justify-between">
                    <span className="text-gray-600">{label}:</span>
                    <span className="font-medium">{value}</span>
                </div>
            );
        }
        return (
            <div className="flex justify-between">
                <span className="text-gray-600">{label}:</span>
                <span className="font-medium">{value || 'N/A'}</span>
            </div>
        );
    }

    return (
        <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">{label}:</span>
            <div className="flex-1 ml-2">
                {options ? (
                    <select
                        value={currentValue}
                        onChange={(e) => updateField(section, field, e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {options.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                ) : type === "date" ? (
                    <input
                        type="date"
                        value={(currentValue && currentValue !== "N/A")? new Date(currentValue).toISOString().split('T')[0] : ''}
                        onChange={(e) => updateField(section, field, e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                ) : type === "number" ? (
                    <input
                        type="number"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onBlur={() => {
                            const num = parseFloat(inputValue);
                            updateField(section, field, isNaN(num) ? 0 : num);
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                ) : type === "textarea" ? (
                    <textarea
                        value={currentValue}
                        onChange={(e) => updateField(section, field, e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="2"
                    />
                ) : (
                    <input
                        type="text"
                        value={currentValue}
                        onChange={(e) => updateField(section, field, field === 'code' ? e.target.value.toUpperCase() : e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                )}
            </div>
        </div>
    );
});

EditableField.displayName = 'EditableField';

export default EditableField;
