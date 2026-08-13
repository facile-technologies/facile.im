import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../utils/endpoints';

import { setSessionExpired } from '../features/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // If we get an Unauthorized error, trigger the logout/session expired flow
    api.dispatch(setSessionExpired(true));
  }

  // Specific handle for the JSON response structure mentioned by user
  if (result.data && result.data.success === false && result.data.message === "Unauthorized.") {
    api.dispatch(setSessionExpired(true));
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
