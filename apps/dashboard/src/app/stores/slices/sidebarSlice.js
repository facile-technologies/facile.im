// sidebarSlice.js
import { createSlice } from "@reduxjs/toolkit";

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    activeTab: "profile",
  },
  reducers: {
    setSidebarTab: (state, action) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setSidebarTab } = sidebarSlice.actions;
export default sidebarSlice.reducer;
