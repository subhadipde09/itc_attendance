import { createSlice } from '@reduxjs/toolkit';

const stored = JSON.parse(localStorage.getItem('itc-auth') || 'null');

const authSlice = createSlice({
  name: 'auth',
  initialState: stored || { user: null, accessToken: null, refreshToken: null, tempToken: null },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.tempToken = null;
      localStorage.setItem('itc-auth', JSON.stringify(state));
    },
    setTotpPending: (state, action) => {
      state.tempToken = action.payload.tempToken;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.tempToken = null;
      localStorage.removeItem('itc-auth');
    },
  },
});

export const { setCredentials, setTotpPending, logout } = authSlice.actions;
export default authSlice.reducer;
