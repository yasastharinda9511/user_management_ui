import React, { useState } from 'react';
import EditableField from "../EditableField.jsx";
import {formatCurrency} from "../../../../utils/common.js";
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';

const FinancialSummarySection = ({editedData, editingSection, financials, updateField} ) => {
    const [showOtherExpenses, setShowOtherExpenses] = useState(false);
    const [newExpenseName, setNewExpenseName] = useState('');
    const [newExpenseAmount, setNewExpenseAmount] = useState('');

    // Get other_expenses_lkr as object or initialize as empty object
    const getOtherExpenses = () => {
        const expenses = editedData.financials?.other_expenses_lkr || financials.other_expenses_lkr;
        // If it's a number (old format), convert to object
        if (typeof expenses === 'number') {
            return {};
        }
        return expenses || {};
    };

    const otherExpenses = getOtherExpenses();

    // Calculate total of other expenses
    const calculateOtherExpensesTotal = () => {
        const expenses = getOtherExpenses();
        return Object.values(expenses).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    };

    // Update individual expense field within other_expenses_lkr JSON object
    const updateOtherExpense = (expenseKey, value) => {
        const currentExpenses = getOtherExpenses();
        const updatedExpenses = {
            ...currentExpenses,
            [expenseKey]: parseFloat(value) || 0
        };
        updateField('financials', 'other_expenses_lkr', updatedExpenses);
    };

    // Add new expense entry
    const addNewExpense = () => {
        if (!newExpenseName.trim() || !newExpenseAmount) {
            return;
        }
        // Convert name to snake_case for consistency
        const expenseKey = newExpenseName.trim().toLowerCase().replace(/\s+/g, '_');
        const currentExpenses = getOtherExpenses();
        const updatedExpenses = {
            ...currentExpenses,
            [expenseKey]: parseFloat(newExpenseAmount) || 0
        };
        updateField('financials', 'other_expenses_lkr', updatedExpenses);
        setNewExpenseName('');
        setNewExpenseAmount('');
    };

    // Delete expense entry
    const deleteExpense = (expenseKey) => {
        const currentExpenses = getOtherExpenses();
        const { [expenseKey]: removed, ...updatedExpenses } = currentExpenses;
        updateField('financials', 'other_expenses_lkr', updatedExpenses);
    };

    // Format expense key for display (snake_case to Title Case)
    const formatExpenseName = (key) => {
        return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    return(<div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        <EditableField
            label="Payements(TT)"
            value={formatCurrency(editedData.financials?.tt_lkr || financials.tt_lkr)}
            section="financials"
            field="tt_lkr"
            type="number"
            isEditing={editingSection !== null}
            currentValue={editedData.financials?.tt_lkr || financials.tt_lkr || 0}
            updateField={updateField}
        />
        <EditableField
            label="Charges (LKR)"
            value={formatCurrency(editedData.financials?.charges_lkr || financials.charges_lkr)}
            section="financials"
            field="charges_lkr"
            type="number"
            isEditing={editingSection !== null}
            currentValue={editedData.financials?.charges_lkr || financials.charges_lkr || 0}
            updateField={updateField}
        />
        <EditableField
            label="Duty (LKR)"
            value={formatCurrency(editedData.financials?.duty_lkr || financials.duty_lkr)}
            section="financials"
            field="duty_lkr"
            type="number"
            isEditing={editingSection !== null}
            currentValue={editedData.financials?.duty_lkr || financials.duty_lkr || 0}
            updateField={updateField}
        />
        <EditableField
            label="Clearing (LKR)"
            value={formatCurrency(editedData.financials?.clearing_lkr || financials.clearing_lkr)}
            section="financials"
            field="clearing_lkr"
            type="number"
            isEditing={editingSection !== null}
            currentValue={editedData.financials?.clearing_lkr || financials.clearing_lkr || 0}
            updateField={updateField}
        />

        {/* LC Cost - Read-only from Purchase section */}
        <div className="flex justify-between py-2 px-3 bg-blue-50 rounded border border-blue-100">
            <span className="text-sm text-gray-600">LC Cost (LKR):</span>
            <span className="text-sm font-medium text-gray-900">
                {formatCurrency(editedData.purchase?.lc_cost_jpy || 0, 'LKR')}
            </span>
        </div>

        {/* Other Expenses Section */}
        <div className="border-t pt-3">
            <button
                type="button"
                onClick={() => setShowOtherExpenses(!showOtherExpenses)}
                className="w-full flex items-center justify-between text-left mb-2 hover:bg-gray-50 p-2 rounded transition-colors"
            >
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Other Expenses</span>
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full font-medium">
                        {formatCurrency(calculateOtherExpensesTotal())}
                    </span>
                </div>
                {showOtherExpenses ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </button>

            {showOtherExpenses && (
                <div className="space-y-2 pl-3 border-l-2 border-gray-200">
                    {editingSection !== null ? (
                        <>
                            {/* Existing Expenses - Editable List */}
                            <div className="space-y-2">
                                {Object.entries(otherExpenses).map(([key, value]) => (
                                    <div key={key} className="flex items-center gap-2">
                                        <div className="flex-1">
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                {formatExpenseName(key)}
                                            </label>
                                            <input
                                                type="number"
                                                value={value || 0}
                                                onChange={(e) => updateOtherExpense(key, e.target.value)}
                                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => deleteExpense(key)}
                                            className="mt-5 p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                            title="Delete expense"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Add New Expense Form */}
                            <div className="pt-3 border-t border-gray-200">
                                <div className="text-xs font-medium text-gray-600 mb-2">Add New Expense</div>
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={newExpenseName}
                                        onChange={(e) => setNewExpenseName(e.target.value)}
                                        placeholder="Expense name (e.g., Car Wash)"
                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                            }
                                        }}
                                    />
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={newExpenseAmount}
                                            onChange={(e) => setNewExpenseAmount(e.target.value)}
                                            placeholder="Amount"
                                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addNewExpense();
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={addNewExpense}
                                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-1 text-sm"
                                        >
                                            <Plus className="w-3 h-3" />
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-1 text-sm">
                            {Object.entries(otherExpenses).map(([key, value]) => (
                                value > 0 && (
                                    <div key={key} className="flex justify-between text-gray-600">
                                        <span>{formatExpenseName(key)}:</span>
                                        <span className="font-medium">{formatCurrency(value)}</span>
                                    </div>
                                )
                            ))}
                            {Object.keys(otherExpenses).length === 0 && (
                                <div className="text-gray-400 text-xs italic">No expenses added</div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>

        <div className="border-t pt-3">
            <div className="flex justify-between">
                <span className="text-gray-600 font-semibold">Total Cost:</span>
                <span className="font-bold text-lg text-green-600">
                    {formatCurrency(editedData.financials?.total_cost_lkr || 0)}
                </span>
            </div>
            <p className="text-xs text-gray-500 mt-1 italic">
                Includes: TT, Charges, Duty, Clearing, LC Cost, and Other Expenses
            </p>
        </div>
    </div>);
}

export default FinancialSummarySection;