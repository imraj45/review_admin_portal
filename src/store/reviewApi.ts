import { apiSlice } from './apiSlice'

export interface Review {
  id: string
  userId: string
  userEmail: string
  platformId: string
  screenshotData: string
  screenshotMimeType: string
  status: string
  adminComment: string | null
  createdAt: string
  updatedAt: string
}

interface ReviewActionRequest {
  id: string
  comment: string
}

export const reviewApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query<Review[], void>({
      query: () => '/reviews',
      providesTags: ['Reviews'],
    }),
    approveReview: builder.mutation<void, ReviewActionRequest>({
      query: ({ id, comment }) => ({
        url: `/reviews/${id}/approve`,
        method: 'PATCH',
        body: { comment },
      }),
      invalidatesTags: ['Reviews'],
    }),
    rejectReview: builder.mutation<void, ReviewActionRequest>({
      query: ({ id, comment }) => ({
        url: `/reviews/${id}/reject`,
        method: 'PATCH',
        body: { comment },
      }),
      invalidatesTags: ['Reviews'],
    }),
    deleteReview: builder.mutation<void, string>({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Reviews'],
    }),
  }),
})

export const {
  useGetReviewsQuery,
  useApproveReviewMutation,
  useRejectReviewMutation,
  useDeleteReviewMutation,
} = reviewApi
