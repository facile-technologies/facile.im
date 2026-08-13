import { baseApi } from './baseApi';
import { ENDPOINTS } from '../../utils/endpoints';

export const userApi = baseApi.injectEndpoints({
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ page = 1, limit = 20, search }) => ({
        url: ENDPOINTS.USERS.GET_ALL,
        params: {
          page,
          limit,
          search: search || undefined,
        },
      }),
      providesTags: ['Users'],
    }),
  }),
});

export const { useGetUsersQuery } = userApi;
