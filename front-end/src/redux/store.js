import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"; // Adjust the path as necessary

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;

// import { createStore } from "redux";

// const initialState = {
//   user: {
//     userId: null, // Initial state for userId
//   },
// };

// const rootReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case "SET_USER_ID":
//       return {
//         ...state,
//         user: {
//           ...state.user,
//           userId: action.payload,
//         },
//       };
//     default:
//       return state;
//   }
// };

// const store = createStore(rootReducer);

// export default store;
