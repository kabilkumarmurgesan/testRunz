// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const loginUserSlice = createSlice({
  name: 'userLogin',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    fetchLoginUserStart: (state) => {
      state.loading = true;
    },
    fetchLoginUserSuccess: (state, action) => {
      console.log(action);
      
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
    fetchLoginUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // fetchLoginUserLogout: (state) => {
    //   state.data = null;
    // },
  },
});

export const {
    fetchLoginUserStart,
    fetchLoginUserSuccess,
    fetchLoginUserFailure,
    // fetchLoginUserLogout
} = loginUserSlice.actions;

export default loginUserSlice.reducer;
