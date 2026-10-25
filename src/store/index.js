import { configureStore } from '@reduxjs/toolkit';
import partsReducer from './slices/partsSlice';

export const store = configureStore({
  reducer: {
    parts: partsReducer,
  },
});
