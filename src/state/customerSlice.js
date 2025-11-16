import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import customerService from '../api/customerService';

// Fetch all customers
export const fetchCustomers = createAsyncThunk(
    'customers/fetchCustomers',
    async (_, { rejectWithValue }) => {
        try {
            const data = await customerService.getAllCustomers();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Fetch customer by ID
export const fetchCustomerById = createAsyncThunk(
    'customers/fetchCustomerById',
    async (customerId, { rejectWithValue }) => {
        try {
            const data = await customerService.getCustomerById(customerId);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Create new customer
export const createCustomer = createAsyncThunk(
    'customers/createCustomer',
    async (customerData, { rejectWithValue }) => {
        try {
            const data = await customerService.createCustomer(customerData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Update customer
export const updateCustomer = createAsyncThunk(
    'customers/updateCustomer',
    async ({ customerId, customerData }, { rejectWithValue }) => {
        try {
            const data = await customerService.updateCustomer(customerId, customerData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Delete customer
export const deleteCustomer = createAsyncThunk(
    'customers/deleteCustomer',
    async (customerId, { rejectWithValue }) => {
        try {
            const data = await customerService.deleteCustomer(customerId);
            return { customerId, ...data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Update customer status
export const updateCustomerStatus = createAsyncThunk(
    'customers/updateCustomerStatus',
    async ({ customerId, isActive }, { rejectWithValue }) => {
        try {
            const data = await customerService.updateCustomerStatus(customerId, isActive);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Initial state
const initialState = {
    customers: [],
    selectedCustomer: null,
    totalCount: 0,
    loading: false,
    loadingCustomer: false,
    updating: false,
    error: null,
    updateError: null,
};

// Customer slice
const customerSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
            state.updateError = null;
        },
        clearSelectedCustomer: (state) => {
            state.selectedCustomer = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Customers
            .addCase(fetchCustomers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.loading = false;
                state.customers = action.payload.data || action.payload || [];
                state.totalCount = action.payload.meta.total || (action.payload.customers ? action.payload.customers.length : action.payload.length);
            })
            .addCase(fetchCustomers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.customers = [];
                state.totalCount = 0;
            })

            // Fetch Customer by ID
            .addCase(fetchCustomerById.pending, (state) => {
                state.loadingCustomer = true;
                state.error = null;
            })
            .addCase(fetchCustomerById.fulfilled, (state, action) => {
                state.loadingCustomer = false;
                state.selectedCustomer = action.payload.data || action.payload;
            })
            .addCase(fetchCustomerById.rejected, (state, action) => {
                state.loadingCustomer = false;
                state.error = action.payload;
                state.selectedCustomer = null;
            })

            // Create Customer
            .addCase(createCustomer.pending, (state) => {
                state.updating = true;
                state.updateError = null;
            })
            .addCase(createCustomer.fulfilled, (state, action) => {
                state.updating = false;
                state.customers.unshift(action.payload);
                state.totalCount += 1;
            })
            .addCase(createCustomer.rejected, (state, action) => {
                state.updating = false;
                state.updateError = action.payload;
            })

            // Update Customer
            .addCase(updateCustomer.pending, (state) => {
                state.updating = true;
                state.updateError = null;
            })
            .addCase(updateCustomer.fulfilled, (state, action) => {
                state.updating = false;
                const index = state.customers.findIndex(c => c.id === action.payload.id || c.customer_id === action.payload.customer_id);
                if (index !== -1) {
                    state.customers[index] = action.payload;
                }
                if (state.selectedCustomer && (state.selectedCustomer.id === action.payload.id || state.selectedCustomer.customer_id === action.payload.customer_id)) {
                    state.selectedCustomer = action.payload;
                }
            })
            .addCase(updateCustomer.rejected, (state, action) => {
                state.updating = false;
                state.updateError = action.payload;
            })

            // Delete Customer
            .addCase(deleteCustomer.pending, (state) => {
                state.updating = true;
                state.updateError = null;
            })
            .addCase(deleteCustomer.fulfilled, (state, action) => {
                state.updating = false;
                state.customers = state.customers.filter(c => c.id !== action.payload.customerId && c.customer_id !== action.payload.customerId);
                state.totalCount -= 1;
                if (state.selectedCustomer && (state.selectedCustomer.id === action.payload.customerId || state.selectedCustomer.customer_id === action.payload.customerId)) {
                    state.selectedCustomer = null;
                }
            })
            .addCase(deleteCustomer.rejected, (state, action) => {
                state.updating = false;
                state.updateError = action.payload;
            })

            // Update Customer Status
            .addCase(updateCustomerStatus.pending, (state) => {
                state.updating = true;
                state.updateError = null;
            })
            .addCase(updateCustomerStatus.fulfilled, (state, action) => {
                state.updating = false;
                const index = state.customers.findIndex(c => c.id === action.payload.id || c.customer_id === action.payload.customer_id);
                if (index !== -1) {
                    state.customers[index] = action.payload;
                }
            })
            .addCase(updateCustomerStatus.rejected, (state, action) => {
                state.updating = false;
                state.updateError = action.payload;
            });
    },
});

// Actions
export const { clearError, clearSelectedCustomer } = customerSlice.actions;

// Selectors
export const selectCustomers = (state) => state.customers.customers;
export const selectSelectedCustomer = (state) => state.customers.selectedCustomer;
export const selectTotalCount = (state) => state.customers.totalCount;
export const selectLoading = (state) => state.customers.loading;
export const selectLoadingCustomer = (state) => state.customers.loadingCustomer;
export const selectUpdating = (state) => state.customers.updating;
export const selectError = (state) => state.customers.error;
export const selectUpdateError = (state) => state.customers.updateError;

// Stats selectors
export const selectActiveCustomersCount = (state) =>
    state.customers.customers.filter(c => c.is_active).length;

export const selectCustomersByType = (state, customerType) =>
    state.customers.customers.filter(c => c.customer_type === customerType);

export default customerSlice.reducer;
