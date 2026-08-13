// app/stores/slices/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const loadSubscriptionPlan = () => {
  try {
    const stored = localStorage.getItem('subscriptionPlan');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const loadProfileMode = () => {
  try {
    return localStorage.getItem('profileMode') || 'network';
  } catch {
    return 'network';
  }
};

const initialState = {
  user: null,
  loading: true,
  profile_image: null,
  subscriptionPlan: loadSubscriptionPlan(),
  profileMode: loadProfileMode(), // 'network' | 'rescue'
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.loading = false;
    },
    setProfileImage(state, action) {
      state.profile_image = action.payload;
    },
    setSubscriptionPlan(state, action) {
      state.subscriptionPlan = action.payload;
      try {
        localStorage.setItem('subscriptionPlan', JSON.stringify(action.payload));
      } catch {}
    },
    setProfileMode(state, action) {
      state.profileMode = action.payload; // 'network' | 'rescue'
      try {
        localStorage.setItem('profileMode', action.payload);
      } catch {}
    },
    clearUser(state) {
      state.user = null;
      state.loading = false;
      state.subscriptionPlan = null;
      localStorage.removeItem('subscriptionPlan');
    },
  },
});

export const { setUser, clearUser, setProfileImage, setSubscriptionPlan, setProfileMode } = userSlice.actions;
export default userSlice.reducer;