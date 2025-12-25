import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import supplierService from '../api/supplierService';

// =====================================================
// ASYNC THUNKS
// =====================================================

// Fetch all suppliers
export const fetchSuppliers = createAsyncThunk(
    'suppliers/fetchAll',
    async ({ page = 1, limit = 10, search = '' } = {}, { rejectWithValue }) => {
        try {
            const response = await supplierService.getAllSuppliers({ page, limit, search });
            return response;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return rejectWithValue(message);
        }
    }
);

// Fetch supplier by ID
export const fetchSupplierById = createAsyncThunk(
    'suppliers/fetchById',
    async (supplierId, { rejectWithValue }) => {
        try {
            const response = await supplierService.getSupplierById(supplierId);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return rejectWithValue(message);
        }
    }
);

// Create supplier
export const createSupplier = createAsyncThunk(
    'suppliers/create',
    async (supplierData, { rejectWithValue }) => {
        try {
            const response = await supplierService.createSupplier(supplierData);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return rejectWithValue(message);
        }
    }
);

// Update supplier
export const updateSupplier = createAsyncThunk(
    'suppliers/update',
    async ({ supplierId, supplierData }, { rejectWithValue }) => {
        try {
            const response = await supplierService.updateSupplier(supplierId, supplierData);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return rejectWithValue(message);
        }
    }
);

// Delete supplier
export const deleteSupplier = createAsyncThunk(
    'suppliers/delete',
    async (supplierId, { rejectWithValue }) => {
        try {
            await supplierService.deleteSupplier(supplierId);
            return supplierId;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return rejectWithValue(message);
        }
    }
);

// Search suppliers
export const searchSuppliers = createAsyncThunk(
    'suppliers/search',
    async (query, { rejectWithValue }) => {
        try {
            const response = await supplierService.searchSuppliers(query);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return rejectWithValue(message);
        }
    }
);

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
    suppliers: [],
    selectedSupplier: null,
    searchResults: [],

    // Pagination
    currentPage: 1,
    totalPages: 1,
    limit: 12,
    totalSuppliers: 0,

    // Loading states
    loading: false,
    loadingSupplier: false,
    updating: false,
    creating: false,
    deleting: false,
    searching: false,

    // Error states
    error: null,
    updateError: null,
    createError: null,
    deleteError: null,
    searchError: null,

    // UI states
    searchQuery: ''
};

// =====================================================
// SLICE
// =====================================================

const supplierSlice = createSlice({
    name: 'suppliers',
    initialState,
    reducers: {
        // Set current page
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },

        // Set page limit
        setPageLimit: (state, action) => {
            state.limit = action.payload;
            state.currentPage = 1; // Reset to first page
        },

        // Set search query
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },

        // Clear selected supplier
        clearSelectedSupplier: (state) => {
            state.selectedSupplier = null;
        },

        // Clear errors
        clearErrors: (state) => {
            state.error = null;
            state.updateError = null;
            state.createError = null;
            state.deleteError = null;
            state.searchError = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch all suppliers
        builder
            .addCase(fetchSuppliers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSuppliers.fulfilled, (state, action) => {
                state.loading = false;
                state.suppliers = action.payload.data || action.payload;
                state.totalPages = action.payload.total_pages || 1;
                state.totalSuppliers = action.payload.total || action.payload.data?.length || 0;
                state.currentPage = action.payload.current_page || state.currentPage;
            })
            .addCase(fetchSuppliers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Fetch supplier by ID
        builder
            .addCase(fetchSupplierById.pending, (state) => {
                state.loadingSupplier = true;
                state.error = null;
            })
            .addCase(fetchSupplierById.fulfilled, (state, action) => {
                state.loadingSupplier = false;
                state.selectedSupplier = action.payload;
            })
            .addCase(fetchSupplierById.rejected, (state, action) => {
                state.loadingSupplier = false;
                state.error = action.payload;
            });

        // Create supplier
        builder
            .addCase(createSupplier.pending, (state) => {
                state.creating = true;
                state.createError = null;
            })
            .addCase(createSupplier.fulfilled, (state, action) => {
                state.creating = false;
                state.suppliers.unshift(action.payload);
                state.totalSuppliers += 1;
            })
            .addCase(createSupplier.rejected, (state, action) => {
                state.creating = false;
                state.createError = action.payload;
            });

        // Update supplier
        builder
            .addCase(updateSupplier.pending, (state) => {
                state.updating = true;
                state.updateError = null;
            })
            .addCase(updateSupplier.fulfilled, (state, action) => {
                state.updating = false;
                const index = state.suppliers.findIndex(s => s.id === action.payload.id);
                if (index !== -1) {
                    state.suppliers[index] = action.payload;
                }
                if (state.selectedSupplier?.id === action.payload.id) {
                    state.selectedSupplier = action.payload;
                }
            })
            .addCase(updateSupplier.rejected, (state, action) => {
                state.updating = false;
                state.updateError = action.payload;
            });

        // Delete supplier
        builder
            .addCase(deleteSupplier.pending, (state) => {
                state.deleting = true;
                state.deleteError = null;
            })
            .addCase(deleteSupplier.fulfilled, (state, action) => {
                state.deleting = false;
                state.suppliers = state.suppliers.filter(s => s.id !== action.payload);
                state.totalSuppliers -= 1;
            })
            .addCase(deleteSupplier.rejected, (state, action) => {
                state.deleting = false;
                state.deleteError = action.payload;
            });

        // Search suppliers
        builder
            .addCase(searchSuppliers.pending, (state) => {
                state.searching = true;
                state.searchError = null;
            })
            .addCase(searchSuppliers.fulfilled, (state, action) => {
                state.searching = false;
                state.searchResults = action.payload;
            })
            .addCase(searchSuppliers.rejected, (state, action) => {
                state.searching = false;
                state.searchError = action.payload;
            });
    }
});

// =====================================================
// EXPORTS
// =====================================================

export const {
    setCurrentPage,
    setPageLimit,
    setSearchQuery,
    clearSelectedSupplier,
    clearErrors
} = supplierSlice.actions;

// Selectors
export const selectSuppliers = (state) => state.suppliers.suppliers;
export const selectSelectedSupplier = (state) => state.suppliers.selectedSupplier;
export const selectSearchResults = (state) => state.suppliers.searchResults;
export const selectCurrentPage = (state) => state.suppliers.currentPage;
export const selectTotalPages = (state) => state.suppliers.totalPages;
export const selectPageLimit = (state) => state.suppliers.limit;
export const selectTotalSuppliers = (state) => state.suppliers.totalSuppliers;
export const selectLoading = (state) => state.suppliers.loading;
export const selectLoadingSupplier = (state) => state.suppliers.loadingSupplier;
export const selectSearchQuery = (state) => state.suppliers.searchQuery;

export default supplierSlice.reducer;
