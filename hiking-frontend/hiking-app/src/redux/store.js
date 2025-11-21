import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import loggedUserSlice from '../redux/users/loggedUserSlice';
import trailsTrackingSlice from './pastTrails/trailsTrackingSlice';
import blogsSlice from './blogs/blogsSlice';

const store = configureStore({
  reducer: {
    loggedUser: loggedUserSlice,
    trailsTracking: trailsTrackingSlice,
    blogs: blogsSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
