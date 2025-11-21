import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const addPastTrail = createAsyncThunk(
  'pastTrails/addPastTrail',
  async ({ userId, pastTrailData }) => {
    const response = await axios.post(
      `http://localhost:5000/users/${userId}/user-trails`,
      pastTrailData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  }
);

export const removePastTrail = createAsyncThunk(
  'pastTrails/removePastTrail',
  async ({ userId, trailId }) => {
    const response = await axios.delete(
      `http://localhost:5000/users/${userId}/user-trails/${trailId}`
    );
    return response.data;
  }
);

export const fetchPastTrails = createAsyncThunk(
  'pastTrails/fetchPastTrails',
  async (userId) => {
    const response = await axios.get(
      `http://localhost:5000/users/${userId}/user-trails`
    );
    return response.data.trails;
  }
);

export const fetchSinglePastTrail = createAsyncThunk(
  'pastTrails/fetchSingleTrail',
  async ({ userId, trailId }) => {
    const response = await axios.get(
      `http://localhost:5000/users/${userId}/user-trails/${trailId}`
    );
    return response.data;
  }
);

const initialState = {
  pastTrails: [],
  loading: false,
  error: null,
  selectedTrail: null,
};

const trailsTracking = createSlice({
  name: 'pastTrails',
  initialState,
  reducers: {
    addPastTrailStart(state) {
      state.loading = true;
      state.error = null;
    },
    addPastTrailSuccess(state, action) {
      state.pastTrails.push(action.payload);
      state.loading = false;
    },
    addPastTrailFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    removePastTrail(state, action) {
      state.pastTrails = state.pastTrails.filter(
        (trail) => trail._id !== action.payload.id
      );
    },
    setPastTrails(state, action) {
      state.pastTrails = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedTrail(state, action) {
      state.selectedTrail = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addPastTrail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPastTrail.fulfilled, (state, action) => {
        state.pastTrails.push(action.payload);
        state.loading = false;
      })
      .addCase(addPastTrail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(removePastTrail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removePastTrail.fulfilled, (state, action) => {
        state.pastTrails = state.pastTrails.filter(
          (trail) => trail._id !== action.payload.id
        );
        state.loading = false;
      })
      .addCase(removePastTrail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchPastTrails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPastTrails.fulfilled, (state, action) => {
        state.pastTrails = action.payload;
        state.loading = false;
      })
      .addCase(fetchPastTrails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchSinglePastTrail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSinglePastTrail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTrail = action.payload;
      })
      .addCase(fetchSinglePastTrail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  addPastTrailStart,
  addPastTrailSuccess,
  addPastTrailFailure,
  setPastTrails,
  setSelectedTrail,
} = trailsTracking.actions;

export default trailsTracking.reducer;
