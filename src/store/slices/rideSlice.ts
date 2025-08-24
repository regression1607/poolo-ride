import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Ride, RideSearchFilters } from '../../types/ride';

interface RideState {
  rides: Ride[];
  searchResults: Ride[];
  userRides: Ride[];
  bookedRides: Ride[];
  currentRide: Ride | null;
  isLoading: boolean;
  error: string | null;
  searchFilters: RideSearchFilters;
}

const initialState: RideState = {
  rides: [],
  searchResults: [],
  userRides: [],
  bookedRides: [],
  currentRide: null,
  isLoading: false,
  error: null,
  searchFilters: {},
};

const rideSlice = createSlice({
  name: 'rides',
  initialState,
  reducers: {
    // Search rides
    searchRidesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    searchRidesSuccess: (state, action: PayloadAction<Ride[]>) => {
      state.isLoading = false;
      state.searchResults = action.payload;
      state.error = null;
    },
    searchRidesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    
    // Create ride
    createRideStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    createRideSuccess: (state, action: PayloadAction<Ride>) => {
      state.isLoading = false;
      state.userRides.push(action.payload);
      state.error = null;
    },
    createRideFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    
    // Fetch user rides
    fetchUserRidesSuccess: (state, action: PayloadAction<Ride[]>) => {
      state.userRides = action.payload;
    },
    
    // Fetch booked rides
    fetchBookedRidesSuccess: (state, action: PayloadAction<Ride[]>) => {
      state.bookedRides = action.payload;
    },
    
    // Set search filters
    setSearchFilters: (state, action: PayloadAction<RideSearchFilters>) => {
      state.searchFilters = { ...state.searchFilters, ...action.payload };
    },
    
    // Clear search results
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    
    // Set current ride
    setCurrentRide: (state, action: PayloadAction<Ride | null>) => {
      state.currentRide = action.payload;
    },
    
    // Update ride
    updateRide: (state, action: PayloadAction<Ride>) => {
      const index = state.userRides.findIndex(ride => ride.id === action.payload.id);
      if (index !== -1) {
        state.userRides[index] = action.payload;
      }
    },
    
    // Clear error
    clearRideError: (state) => {
      state.error = null;
    },
  },
});

export const {
  searchRidesStart,
  searchRidesSuccess,
  searchRidesFailure,
  createRideStart,
  createRideSuccess,
  createRideFailure,
  fetchUserRidesSuccess,
  fetchBookedRidesSuccess,
  setSearchFilters,
  clearSearchResults,
  setCurrentRide,
  updateRide,
  clearRideError,
} = rideSlice.actions;

export default rideSlice.reducer;
