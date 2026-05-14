import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';

/**
 * Store unique — state global prévisible (pattern standard entreprise).
 * RTK vs useReducer : RTK scale sur plusieurs slices, middlewares, DevTools, et réduit le boilerplate.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
