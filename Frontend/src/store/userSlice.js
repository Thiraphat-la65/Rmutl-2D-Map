import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: { isAuthenticated: !!localStorage.getItem('token') }, // ตรวจสอบ token
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
    },
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;