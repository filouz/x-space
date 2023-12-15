import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ChartDataItem {
  name: number,
  value: number
}

export interface ChartState {
  activityData: ChartDataItem[];
  switchData: ChartDataItem[];
}

const initialState: ChartState = {
  activityData: [],
  switchData: [],
};

export const chartSlice = createSlice({
  name: 'chart',
  initialState,
  reducers: {
    updateSwitchChart: (state, action: PayloadAction<ChartDataItem>) => {
      state.switchData.push(action.payload);
    },
    updateActivityChart: (state, action: PayloadAction<ChartDataItem>) => {
      state.activityData.push(action.payload);
    },
    
  },
});

export const { updateSwitchChart, updateActivityChart } = chartSlice.actions;
export default chartSlice.reducer;
