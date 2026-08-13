import { baseApi } from './baseApi';
import { ENDPOINTS } from '../../utils/endpoints';

export const platformApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlatforms: builder.query({
      query: ({ page = 1, limit = 20 } = {}) => ({
        url: ENDPOINTS.PLATFORMS.GET_ALL,
        params: { page, limit },
      }),
      providesTags: ['Platforms'],
    }),
    createPlatform: builder.mutation({
      query: (newPlatform) => ({
        url: ENDPOINTS.PLATFORMS.GET_ALL,
        method: 'POST',
        body: newPlatform,
      }),
      invalidatesTags: ['Platforms'],
    }),
    updatePlatform: builder.mutation({
      query: ({ id, ...updatedPlatform }) => ({
        url: `${ENDPOINTS.PLATFORMS.GET_ALL}/${id}`,
        method: 'PATCH',
        body: updatedPlatform,
      }),
      invalidatesTags: ['Platforms'],
    }),
    deletePlatform: builder.mutation({
      query: (id) => ({
        url: `${ENDPOINTS.PLATFORMS.GET_ALL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Platforms'],
    }),
  }),
});

export const {
  useGetPlatformsQuery,
  useCreatePlatformMutation,
  useUpdatePlatformMutation,
  useDeletePlatformMutation,
} = platformApi;
