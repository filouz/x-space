import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of the markdown state
export interface MarkdownState {
  content: string;
}

const initialState: MarkdownState = {
  content: '',
};

export const markdownSlice = createSlice({
  name: 'markdown',
  initialState,
  reducers: {
    updateMarkdown: (state, action: PayloadAction<string>) => {
      state.content = action.payload;
    },
  },
});

export const { updateMarkdown } = markdownSlice.actions;
export default markdownSlice.reducer;
