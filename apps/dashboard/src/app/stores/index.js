import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './slices/profileSlice';
import linksReducer from './slices/linkSlice';
import sosprofileReducer from './slices/sosprofileSlice';
import petprofileReducer from './slices/petprofileSlice';
import sidebarReducer from './slices/sidebarSlice';
import bussinessprofileSlice from './slices/businessProfileSlice';
import userReducer from './slices/userSlice';

import dashboardReducer from './slices/dashboardSlice';
import pagePathReducer from './slices/pagePathSlice';

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    links: linksReducer,
    sosprofile: sosprofileReducer,
    petprofile: petprofileReducer,
    sidebar: sidebarReducer,
    businessprofile: bussinessprofileSlice,
    user: userReducer,
    dashboard: dashboardReducer,
    pagePath: pagePathReducer,
  
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore specific action or state paths
        ignoredActions: ['sosprofile/setBgImage'],
        ignoredPaths: ['sosprofile.customization.backgroundImage'],
      },
    }),
});
