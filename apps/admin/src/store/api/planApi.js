import { baseApi } from './baseApi';
import { ENDPOINTS } from '../../utils/endpoints';

export const planApi = baseApi.injectEndpoints({
  tagTypes: ['Plans'],
  endpoints: (builder) => ({
    getPlans: builder.query({
      query: () => ({
        url: ENDPOINTS.PLANS.GET_ALL,
        method: 'GET',
      }),
      providesTags: ['Plans'],
    }),
    createPlan: builder.mutation({
      query: (body) => ({
        url: ENDPOINTS.PLANS.GET_ALL,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Plans'],
    }),
    updatePlan: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${ENDPOINTS.PLANS.GET_ALL}/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Plans'],
    }),
    deletePlan: builder.mutation({
      query: (id) => ({
        url: `${ENDPOINTS.PLANS.GET_ALL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Plans'],
    }),
  }),
});

export const { useGetPlansQuery, useCreatePlanMutation, useUpdatePlanMutation, useDeletePlanMutation } = planApi;
