import { baseApi } from './baseApi';
import { ENDPOINTS } from '../../utils/endpoints';

export const nfcApi = baseApi.injectEndpoints({
  tagTypes: ['NfcChips'],
  endpoints: (builder) => ({
    getNfcCodes: builder.query({
      query: ({ tab, page = 1, limit = 20, search }) => ({
        url: ENDPOINTS.NFC.GET_CODES,
        params: {
          tab,
          page,
          limit,
          search: search || undefined,
        },
      }),
      providesTags: ['NfcChips'],
    }),
    getDevices: builder.query({
      query: () => ENDPOINTS.NFC.DEVICES,
      providesTags: ['NfcChips'],
    }),
    generateNfcCodes: builder.mutation({
      query: (data) => ({
        url: ENDPOINTS.NFC.GENERATE,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['NfcChips'],
    }),
    updateNfcChip: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${ENDPOINTS.NFC.GET_CODES}/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['NfcChips'],
    }),
  }),
});

export const {
  useGetNfcCodesQuery,
  useGetDevicesQuery,
  useGenerateNfcCodesMutation,
  useUpdateNfcChipMutation
} = nfcApi;
