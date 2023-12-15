import { configureStore } from '@reduxjs/toolkit';
import markdownReducer from './slices/markdownSlice';
import mapReducer from './slices/mapSlice';
import chartReducer from './slices/chartSlice';

const store = configureStore({
  reducer: {
    markdown: markdownReducer,
    map: mapReducer,
    chart: chartReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export default store;