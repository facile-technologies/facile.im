import { baseApi } from './baseApi';
import { ENDPOINTS } from '../../utils/endpoints';

export const teamsApi = baseApi.injectEndpoints({
  tagTypes: ['Teams'],
  endpoints: (builder) => ({
    getTeams: builder.query({
      query: (params) => ({
        url: ENDPOINTS.TEAMS.GET_ALL,
        params,
      }),
      providesTags: ['Teams'],
    }),
  }),
});

export const { useGetTeamsQuery } = teamsApi;
