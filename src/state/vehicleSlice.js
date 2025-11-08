import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {URLBuilder} from "../components/util/URLUtil.js";
import config from "../configs/config.json";

// API Base URL - adjust according to your setup
const API_BASE_URL = config.car_service.base_url;

// Fetch all vehicles with pagination
export const fetchVehicles = createAsyncThunk(
    'vehicles/fetchVehicles',
    async ({ page = 1, limit = 10, filters } = {}, { rejectWithValue }) => {
        try {

            const queryParams = { ...filters };
            queryParams.page = page;
            queryParams.limit = limit;

            const url = URLBuilder(`${API_BASE_URL}/vehicles`, queryParams);
            console.log(url);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Fetch single vehicle by ID
export const fetchVehicleById = createAsyncThunk(
    'vehicles/fetchVehicleById',
    async (vehicleId, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Create new vehicle
export const createVehicle = createAsyncThunk(
    'vehicles/createVehicle',
    async (vehicleData, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/vehicles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(vehicleData),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Update vehicle details
export const updateVehicle = createAsyncThunk(
    'vehicles/updateVehicle',
    async ({ vehicleId, updateData }, { rejectWithValue }) => {
        try {
            console.log(vehicleId);
            const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // Return the updated vehicle data along with the ID
            return { vehicleId, ...updateData };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Update vehicle purchase details
export const updateVehiclePurchase = createAsyncThunk(
    'vehicles/updateVehiclePurchase',
    async ({ vehicleId, purchaseData }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}/purchase`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(purchaseData),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return { vehicleId, purchaseData };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Update vehicle shipping details
export const updateVehicleShipping = createAsyncThunk(
    'vehicles/updateVehicleShipping',
    async ({ vehicleId, shippingData }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}/shipping`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(shippingData),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return { vehicleId, shippingData };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Update vehicle financial details
export const updateVehicleFinancials = createAsyncThunk(
    'vehicles/updateVehicleFinancials',
    async ({ vehicleId, financialData }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}/financials`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(financialData),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return { vehicleId, financialData };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Update vehicle sales details
export const updateVehicleSales = createAsyncThunk(
    'vehicles/updateVehicleSales',
    async ({ vehicleId, salesData }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}/sales`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(salesData),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return { vehicleId, salesData };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createVehicleRecordWithImage = createAsyncThunk(
    'vehicles/create',
    async ({vehicleData, images }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/vehicles`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(vehicleData)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const vehicle = await response.json();

            if(images.length > 0){
                const formData = new FormData();
                images.forEach(image => formData.append('images', image.file));

                const imageResponse = await fetch(`${API_BASE_URL}/vehicles/upload-image/${vehicle.data.id}`, {
                    method: 'POST',
                    body: formData
                });

                if (!imageResponse.ok) {
                    // Vehicle was created but image upload failed
                    // You might want to handle this scenario
                    console.warn('Vehicle created but image upload failed');
                }
            }


        }catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


// Fetch all dropdown options for filters
export const fetchAllOptions = createAsyncThunk(
    'vehicles/fetchAllOptions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:8080/car-service/api/v1/vehicles/dropdown/options`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.data || data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
    // Vehicle data
    vehicles: [],
    selectedVehicle: null,

    // Pagination
    currentPage: 1,
    totalPages: 1,
    limit: 10,
    totalVehicles: 0,

    // Loading states
    loading: false,
    loadingVehicle: false,
    updating: false,
    loadingOptions: false,

    // Error states
    error: null,
    updateError: null,
    optionsError: null,

    // UI states
    filters: {
        search: '',
        make: '',
        model: '',
        year: '',
        shipping_status: '',
        priceRangeMin: '',
        priceRangeMax: '',
        dateRangeStart: '',
        dateRangeEnd: '',
        color: '',
        transmission: '',
        fuelType: ''
    },
    sortBy: 'created_at',
    sortOrder: 'desc',

    // Filter options from backend
    filterOptions: {
        makes_models: {},
        years: [],
        shipping_statuses: [],
        sale_statuses:[],
        condition_statuses:[],
        colors: [],
        transmissions: [],
        fuelTypes: []
    },

    shouldRefresh:false
};

// =====================================================
// VEHICLE SLICE
// =====================================================

const vehicleSlice = createSlice({
    name: 'vehicles',
    initialState,
    reducers: {
        // Clear errors
        clearError: (state) => {
            state.error = null;
            state.updateError = null;
        },

        // Clear selected vehicle
        clearSelectedVehicle: (state) => {
            state.selectedVehicle = null;
        },

        // Set filters
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
            state.currentPage = 1; // Reset to first page when filtering
        },

        applyFilters: (state, action) => {
            state.filters = {...action.payload };
        },

        // Clear filters
        clearFilters: (state) => {
            state.filters = {
                search: '',
                brand: '',
                model: '',
                year: '',
                shipping_status: '',
                priceRangeMin: '',
                priceRangeMax: '',
                dateRangeStart: '',
                dateRangeEnd: '',
                color: '',
                transmission: '',
                fuelType: '',
            };
            state.currentPage = 1;
        },

        // Set sorting
        setSorting: (state, action) => {
            const { sortBy, sortOrder } = action.payload;
            state.sortBy = sortBy;
            state.sortOrder = sortOrder;
        },

        // Set current page
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },

        // Set page limit
        setPageLimit: (state, action) => {
            state.limit = action.payload;
            state.currentPage = 1; // Reset to first page when changing limit
        },

        // Update vehicle in list (for real-time updates)
        updateVehicleInList: (state, action) => {
            const { vehicleId, updates } = action.payload;
            const vehicleIndex = state.vehicles.findIndex(v => v.id === vehicleId);
            if (vehicleIndex !== -1) {
                state.vehicles[vehicleIndex] = { ...state.vehicles[vehicleIndex], ...updates };
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Vehicles
            .addCase(fetchVehicles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVehicles.fulfilled, (state, action) => {
                state.loading = false;
                state.shouldRefresh = false;
                state.vehicles = action.payload.data || [];
                state.currentPage = action.payload.meta?.page || 1;
                state.totalVehicles = action.payload.meta?.total || 0;
                state.totalPages = Math.ceil(state.totalVehicles / state.limit);
            })
            .addCase(fetchVehicles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.vehicles = [];
            })

            // Fetch Vehicle by ID
            .addCase(fetchVehicleById.pending, (state) => {
                state.loadingVehicle = true;
                state.error = null;
            })
            .addCase(fetchVehicleById.fulfilled, (state, action) => {
                state.loadingVehicle = false;
                state.selectedVehicle = action.payload;
            })
            .addCase(fetchVehicleById.rejected, (state, action) => {
                state.loadingVehicle = false;
                state.error = action.payload;
                state.selectedVehicle = null;
            })

            // Create Vehicle
            .addCase(createVehicle.pending, (state) => {
                state.updating = true;
                state.updateError = null;
            })
            .addCase(createVehicle.fulfilled, (state, action) => {
                state.updating = false;
                state.vehicles.unshift(action.payload); // Add to beginning of list
                state.totalVehicles += 1;
            })
            .addCase(createVehicle.rejected, (state, action) => {
                state.updating = false;
                state.updateError = action.payload;
            })

            // Update Vehicle
            .addCase(updateVehicle.pending, (state) => {
                state.updating = true;
                state.updateError = null;
            })
            .addCase(updateVehicle.fulfilled, (state, action) => {
                state.updating = false;
                state.shouldRefresh = true;
                const { vehicleId, ...updates } = action.payload;
                const vehicleIndex = state.vehicles.findIndex(v => v.id === vehicleId);
                if (vehicleIndex !== -1) {
                    state.vehicles[vehicleIndex] = { ...state.vehicles[vehicleIndex], ...updates };
                }
                if (state.selectedVehicle && state.selectedVehicle.id === vehicleId) {
                    state.selectedVehicle = { ...state.selectedVehicle, ...updates };
                }
            })
            .addCase(updateVehicle.rejected, (state, action) => {
                state.updating = false;
                state.updateError = action.payload;
            })

            // Update Vehicle Purchase
            .addCase(updateVehiclePurchase.fulfilled, (state, action) => {
                const { vehicleId, purchaseData } = action.payload;
                state.shouldRefresh = true;
                const vehicleIndex = state.vehicles.findIndex(v => v.id === vehicleId);
                if (vehicleIndex !== -1) {
                    state.vehicles[vehicleIndex] = {
                        ...state.vehicles[vehicleIndex],
                        ...purchaseData
                    };
                }
                if (state.selectedVehicle && state.selectedVehicle.id === vehicleId) {
                    state.selectedVehicle = { ...state.selectedVehicle, ...purchaseData };
                }
            })

            // Update Vehicle Shipping
            .addCase(updateVehicleShipping.fulfilled, (state, action) => {
                state.shouldRefresh = true;
                const { vehicleId, shippingData } = action.payload;
                const vehicleIndex = state.vehicles.findIndex(v => v.id === vehicleId);
                if (vehicleIndex !== -1) {
                    state.vehicles[vehicleIndex] = {
                        ...state.vehicles[vehicleIndex],
                        shippingStatus: shippingData.shipping_status,
                        ...shippingData
                    };
                }
                if (state.selectedVehicle && state.selectedVehicle.id === vehicleId) {
                    state.selectedVehicle = {
                        ...state.selectedVehicle,
                        shippingStatus: shippingData.shipping_status,
                        ...shippingData
                    };
                }
            })

            // Update Vehicle Financials
            .addCase(updateVehicleFinancials.fulfilled, (state, action) => {
                state.shouldRefresh = true;
                const { vehicleId, financialData } = action.payload;
                const vehicleIndex = state.vehicles.findIndex(v => v.id === vehicleId);
                if (vehicleIndex !== -1) {
                    state.vehicles[vehicleIndex] = {
                        ...state.vehicles[vehicleIndex],
                        price: `LKR ${financialData.total_cost_lkr?.toLocaleString()}`,
                        ...financialData
                    };
                }
                if (state.selectedVehicle && state.selectedVehicle.id === vehicleId) {
                    state.selectedVehicle = {
                        ...state.selectedVehicle,
                        price: `LKR ${financialData.total_cost_lkr?.toLocaleString()}`,
                        ...financialData
                    };
                }
            })

            // Update Vehicle Sales
            .addCase(updateVehicleSales.fulfilled, (state, action) => {
                state.shouldRefresh = true;
                const { vehicleId, salesData } = action.payload;
                const vehicleIndex = state.vehicles.findIndex(v => v.id === vehicleId);
                if (vehicleIndex !== -1) {
                    state.vehicles[vehicleIndex] = {
                        ...state.vehicles[vehicleIndex],
                        saleStatus: salesData.sale_status,
                        revenue: salesData.revenue ? `LKR ${salesData.revenue.toLocaleString()}` : 'N/A',
                        profit: salesData.profit ? `LKR ${salesData.profit.toLocaleString()}` : 'N/A',
                        ...salesData
                    };
                }
                if (state.selectedVehicle && state.selectedVehicle.id === vehicleId) {
                    state.selectedVehicle = {
                        ...state.selectedVehicle,
                        saleStatus: salesData.sale_status,
                        revenue: salesData.revenue ? `LKR ${salesData.revenue.toLocaleString()}` : 'N/A',
                        profit: salesData.profit ? `LKR ${salesData.profit.toLocaleString()}` : 'N/A',
                        ...salesData
                    };
                }
            })

            .addCase(createVehicleRecordWithImage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createVehicleRecordWithImage.fulfilled, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createVehicleRecordWithImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch All Options
            .addCase(fetchAllOptions.pending, (state) => {
                state.loadingOptions = true;
                state.optionsError = null;
            })
            .addCase(fetchAllOptions.fulfilled, (state, action) => {
                state.loadingOptions = false;
                state.filterOptions = action.payload;
            })
            .addCase(fetchAllOptions.rejected, (state, action) => {
                state.loadingOptions = false;
                state.optionsError = action.payload;
            });



    },
});

// =====================================================
// ACTIONS
// =====================================================

export const {
    clearError,
    clearSelectedVehicle,
    setFilters,
    clearFilters,
    applyFilters,
    setSorting,
    setCurrentPage,
    setPageLimit,
    updateVehicleInList,
} = vehicleSlice.actions;

// =====================================================
// SELECTORS
// =====================================================

// Basic selectors
export const selectVehicles = (state) => state.vehicles.vehicles;
export const selectSelectedVehicle = (state) => state.vehicles.selectedVehicle;
export const selectLoading = (state) => state.vehicles.loading;
export const selectLoadingVehicle = (state) => state.vehicles.loadingVehicle;
export const selectUpdating = (state) => state.vehicles.updating;
export const selectError = (state) => state.vehicles.error;
export const selectUpdateError = (state) => state.vehicles.updateError;
export const selectShouldRefresh = (state) => state.vehicles.shouldRefresh;
// Pagination selectors
export const selectCurrentPage = (state) => state.vehicles.currentPage;
export const selectTotalPages = (state) => state.vehicles.totalPages;
export const selectPageLimit = (state) => state.vehicles.limit;
export const selectTotalVehicles = (state) => state.vehicles.totalVehicles;

// Filter and sort selectors
export const selectFilters = (state) => state.vehicles.filters;
export const selectSorting = (state) => ({
    sortBy: state.vehicles.sortBy,
    sortOrder: state.vehicles.sortOrder,
});

// Filter options selectors
export const selectFilterOptions = (state) => state.vehicles.filterOptions;
export const selectLoadingOptions = (state) => state.vehicles.loadingOptions;
export const selectOptionsError = (state) => state.vehicles.optionsError;

export const selectVehiclesByStatus = (state) => {
    const vehicles = selectVehicles(state);
    return {
        processing: vehicles.filter(v => v.shippingStatus === 'PROCESSING').length,
        shipped: vehicles.filter(v => v.shippingStatus === 'SHIPPED').length,
        arrived: vehicles.filter(v => v.shippingStatus === 'ARRIVED').length,
        cleared: vehicles.filter(v => v.shippingStatus === 'CLEARED').length,
        delivered: vehicles.filter(v => v.shippingStatus === 'DELIVERED').length,
        available: vehicles.filter(v => v.saleStatus === 'AVAILABLE').length,
        sold: vehicles.filter(v => v.saleStatus === 'SOLD').length,
    };
};

export default vehicleSlice.reducer;