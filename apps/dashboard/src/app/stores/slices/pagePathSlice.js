import { createSlice } from "@reduxjs/toolkit";
const pagePathSlice = createSlice({
  name: "pagePath",
  initialState: {
    pathname: ""
  },
  reducers: {
    setPathname: (state, action) => {
      state.pathname = action.payload;
    }
  }
});
export const { setPathname } = pagePathSlice.actions;
export default pagePathSlice.reducer;