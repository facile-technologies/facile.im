// src/app/stores/slices/linksSlice.js
import { createSlice } from "@reduxjs/toolkit";

const linksSlice = createSlice({
  name: "links",
  initialState: {
    platformLinks: [],
    customLinks: [],
  },
  reducers: {
    addPlatformLink(state, action) {
      state.platformLinks.push(action.payload);
    },
    deletePlatformLink(state, action) {
      state.platformLinks = state.platformLinks.filter((_, i) => i !== action.payload);
    },
  },
});

export const { addPlatformLink, deletePlatformLink } = linksSlice.actions;
export default linksSlice.reducer;