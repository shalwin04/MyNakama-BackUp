// userSlice.js
import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userId: null,
  },
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload; // Correctly update the state
      // console.log("UserSlice", action.payload);
    },
    clearUserId: (state) => {
      state.userId = null;
    },
  },
});

export const { setUserId, clearUserId } = userSlice.actions;
export default userSlice.reducer;
