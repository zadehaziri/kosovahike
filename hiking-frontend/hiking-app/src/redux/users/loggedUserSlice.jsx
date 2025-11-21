import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null, 
  expiresIn: localStorage.getItem('expiresIn') || null,
};

const loggedUser = createSlice({
  name: 'loggedUser',
  initialState,
  reducers: {
    setLoggedUser: (state, action) => {
      const { token, user, expiresIn } = action.payload;
      state.token = token;
      state.user = user;
      state.expiresIn = expiresIn;
      localStorage.setItem('token', token);
      localStorage.setItem('expiresIn', expiresIn);
      localStorage.setItem('user', JSON.stringify(user));
    },
    clearLoggedUser: (state) => {
      state.token = null;
      state.user = null;
      state.expiresIn = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user'); 
      localStorage.removeItem('expiresIn'); 
    },
    updateFavoriteTrails: (state, action) => {
      const { trailId, isAdding } = action.payload;
      if (isAdding) {
        state.user.trailFavorites.push(trailId);
      } else {
        state.user.trailFavorites = state.user.trailFavorites.filter((id) => id !== trailId);
      }
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    updateEvents: (state, action) => {
      const {eventId, isAddingJoining} = action.payload;
      if(isAddingJoining) {
        state.user.eventsAttending.push(eventId);
      } else {
        state.user.eventsAttending = state.user.eventsAttending.filter((id) => id !== eventId);
      }
      localStorage.setItem('user', JSON.stringify(state.user));
    }
  },
});

export const { setLoggedUser, clearLoggedUser, updateFavoriteTrails, updateEvents } = loggedUser.actions;

export default loggedUser.reducer;
