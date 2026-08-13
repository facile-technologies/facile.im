import { baseApi } from './baseApi';
import { ENDPOINTS } from '../../utils/endpoints';

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: (range) => ({
        url: ENDPOINTS.DASHBOARD.GET_STATS,
        params: { range }
      }),
      providesTags: ['Dashboard'],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
