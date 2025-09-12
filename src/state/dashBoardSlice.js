import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import config from "../configs/config.json";
import {URLBuilder} from "../components/util/URLUtil.js";
import {financialStatusColors, shippingStatusColors, vehicleBrandData} from "../components/common/Costants.js";

const API_BASE_URL = config.car_service.base_url;

export const fetchShippingStatus = createAsyncThunk(
    'dashboard/fetchShippingStatus',
    async ({ filters }, { rejectWithValue }) => {
        try {

            const queryParams = { ...filters };
            const url = URLBuilder(`${API_BASE_URL}/analytics/shipping-status`, queryParams);
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchFinancialSummary = createAsyncThunk(
    'dashboard/fetchingFinancialSummary',
    async ({ filters }, { rejectWithValue }) => {
        try {

            const queryParams = { ...filters };
            const url = URLBuilder(`${API_BASE_URL}/analytics/financial-summary`, queryParams);
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchVehicleStats = createAsyncThunk(
    'dashboard/fetchingVehicleBrands',
    async ({ filters }, { rejectWithValue }) => {
        try {

            const queryParams = { ...filters };
            const url = URLBuilder(`${API_BASE_URL}/analytics/vehicle-brand-status`, queryParams);
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetSalesStatusSummary = createAsyncThunk(
    'dashboard/fetchingVehicleBrands',
    async ({ filters }, { rejectWithValue }) => {
        try {

            const queryParams = { ...filters };
            const url = URLBuilder(`${API_BASE_URL}/analytics/vehicle-brand-status`, queryParams);
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);



const transformShippingData = (data) => {
    return Object.entries(data).map(([status, count]) => ({
        name: status.slice(0, 1) + status.slice(1).toLowerCase(),
        value: count,
        color: shippingStatusColors[status] || '#6b7280'
    }));
};

const transformFinancialSummary = (data) => {
    return Object.entries(data).map(([status, count]) => {
        const formattedName = status
            .split('_') // ["total", "charges"]
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' '); // "Total Charges"

        return {
            name: formattedName,
            value: count,
            color: financialStatusColors[status] || '#6b7280'
        };
    });
};

const transformVehicleBrands = (data) => {
    return Object.entries(data).map(([status, count]) => {
        const formattedName = status
            .split('_') // ["total", "charges"]
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' '); // "Total Charges"

        return {
            name: formattedName,
            value: count,
            color: vehicleBrandData[status] || '#6b7280'
        };
    });
};



const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        // Shipping data
        shippingStatus: {
            data: [],
            rawData: {},
            loading: false,
            error: null,
            lastFetched: null
        },

        // Vehicle stats
        vehicleStats: {
            data: [],
            rawData: {},
            loading: false,
            error: null,
            lastFetched: null
        },

        // Financial data
        financialSummary: {
            data: [],
            loading: false,
            error: null,
            lastFetched: null
        },

        // Calculated totals
        totals: {
            totalVehicles: 0,
            inTransit: 0,
            delivered: 0,
            cleared: 0,
            processing: 0,
            shipped: 0,
            arrived: 0
        },
    },

    reducers: {
        setDateRange: (state, action) => {
            state.dateRange = action.payload;
        },

        // Clear errors
        clearError: (state, action) => {
            const { section } = action.payload;
            if (state[section]) {
                state[section].error = null;
            }
        },

        // Reset section
        resetSection: (state, action) => {
            const { section } = action.payload;
            if (state[section]) {
                state[section] = {
                    ...state[section],
                    data: section === 'financialSummary' ? {} : [],
                    rawData: {},
                    error: null
                };
            }
        }
    },

    extraReducers: (builder) => {
        // Shipping Status
        builder
            .addCase(fetchShippingStatus.pending, (state) => {
                state.shippingStatus.loading = true;
                state.shippingStatus.error = null;
            })
            .addCase(fetchShippingStatus.fulfilled, (state, action) => {
                state.shippingStatus.loading = false;
                state.shippingStatus.rawData = action.payload;
                state.shippingStatus.data = transformShippingData(action.payload);
                console.log( JSON.stringify(state.shippingStatus.data));
                state.shippingStatus.lastFetched = Date.now();
            })
            .addCase(fetchShippingStatus.rejected, (state, action) => {
                state.shippingStatus.loading = false;
                state.shippingStatus.error = action.payload;
            })

            .addCase(fetchFinancialSummary.pending, (state) => {
                state.financialSummary.loading = true;
                state.financialSummary.error = null;
            })
            .addCase(fetchFinancialSummary.fulfilled, (state, action) => {
                state.financialSummary.loading = false;
                state.financialSummary.rawData = action.payload;
                state.financialSummary.data = transformFinancialSummary(action.payload);
                console.log( JSON.stringify(state.financialSummary.data));
                state.financialSummary.lastFetched = Date.now();
            })
            .addCase(fetchFinancialSummary.rejected, (state, action) => {
                state.financialSummary.loading = false;
                state.financialSummary.error = action.payload;
            })

            .addCase(fetchVehicleStats.pending, (state) => {
                state.financialSummary.loading = true;
                state.financialSummary.error = null;
            })
            .addCase(fetchVehicleStats.fulfilled, (state, action) => {
                state.vehicleStats.loading = false;
                state.vehicleStats.rawData = action.payload;
                state.vehicleStats.data = transformVehicleBrands(action.payload);
                console.log( JSON.stringify(state.financialSummary.data));
                state.vehicleStats.lastFetched = Date.now();
            })
            .addCase(fetchVehicleStats.rejected, (state, action) => {
                state.vehicleStats.loading = false;
                state.vehicleStats.error = action.payload;
            })
    }
});

// Selectors
export const selectShippingStatus = (state) => state.dashBoard.shippingStatus;
export const selectFinancialSummary = (state) => state.dashBoard.financialSummary;
export const selectVehicleStatsSummary = (state) => state.dashBoard.vehicleStats;
// Check if data is stale (older than 5 minutes)
export const selectIsDataStale = (section) => (state) => {
    const lastFetched = state.dashboard[section]?.lastFetched;
    if (!lastFetched) return true;
    return Date.now() - lastFetched > 5 * 60 * 1000; // 5 minutes
};

// Loading states
export const selectIsAnyLoading = (state) => {
    return state.dashboard.shippingStatus.loading ||
        state.dashboard.vehicleStats.loading ||
        state.dashboard.financialSummary.loading;
};

// Actions
export const {
    setSelectedTab,
    setDateRange,
    clearError,
    resetSection
} = dashboardSlice.actions;

export default dashboardSlice.reducer;

