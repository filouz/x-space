import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of the markdown state
export interface MapState {
  lat: number;
  lng: number;
  hint: string
}

const initialState: MapState = {
  lat: 48.8566, 
  lng: 2.3522,
  hint: "<b>Address:</b> A6B, 94550 Chevilly-Larue, France <br /><br /> <b>Latitude:</b> 48.7685937 <br /> <b>Longitude:</b> 2.3435180"
};

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    updateMap: (state, action: PayloadAction<MapState>) => {
      const { lat, lng, hint } = action.payload;
      state.lat = lat;
      state.lng = lng;
      state.hint = `<b>Address:</b> ${hint} <br /><br /> <b>Latitude:</b> ${lat} <br /> <b>Longitude:</b> ${lng}`;
    },
  },
});

export const { updateMap } = mapSlice.actions;
export default mapSlice.reducer;
