import { createSlice } from '@reduxjs/toolkit';
import {
  fetchBuyerReviewByProductIdAction,
  addBuyerReviewAction,
  updateBuyerReviewAction,
  deleteBuyerReviewAction,
  fetchSellerReviewsAction,
  deleteSellerReviewAction,
} from '@/store/actions/review.action';

export interface IReview {
  id: string;
  productId?: string;
  userId?: string;
  rating?: number;
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ReviewState {
  buyerReviews: IReview[];
  sellerReviews: IReview[];
  loading: string;
  apiName: string;
  alertType: string;
  message: string;
  error: boolean;
}

const initialState: ReviewState = {
  buyerReviews: [],
  sellerReviews: [],
  loading: '',
  apiName: '',
  alertType: '',
  message: '',
  error: false,
};

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    clearReviewState: (state) => {
      state.loading = '';
      state.apiName = '';
      state.alertType = '';
      state.message = '';
      state.error = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBuyerReviewByProductIdAction.pending, (state) => {
        state.apiName = 'buyerReview/fetchByProductId';
        state.loading = 'buyerReview/fetchByProductId';
      })
      .addCase(fetchBuyerReviewByProductIdAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.buyerReviews = payload;
        state.alertType = 'success';
        state.message = 'Buyer reviews fetched';
      })
      .addCase(fetchBuyerReviewByProductIdAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) state.message = payload.message;
      })

      .addCase(addBuyerReviewAction.pending, (state) => {
        state.apiName = 'buyerReview/add';
        state.loading = 'buyerReview/add';
      })
      .addCase(addBuyerReviewAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.buyerReviews.push(payload);
        state.alertType = 'success';
        state.message = 'Review added';
      })
      .addCase(addBuyerReviewAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) state.message = payload.message;
      })

      .addCase(updateBuyerReviewAction.pending, (state) => {
        state.apiName = 'buyerReview/update';
        state.loading = 'buyerReview/update';
      })
      .addCase(updateBuyerReviewAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.buyerReviews = state.buyerReviews.map((review) =>
          review.id === payload._id ? payload : review
        );
        state.alertType = 'success';
        state.message = 'Review updated';
      })
      .addCase(updateBuyerReviewAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) state.message = payload.message;
      })

      .addCase(deleteBuyerReviewAction.pending, (state) => {
        state.apiName = 'buyerReview/delete';
        state.loading = 'buyerReview/delete';
      })
      .addCase(deleteBuyerReviewAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.buyerReviews = state.buyerReviews.filter((r) => r.id !== payload._id);
        state.alertType = 'success';
        state.message = 'Review deleted';
      })
      .addCase(deleteBuyerReviewAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) state.message = payload.message;
      })

      .addCase(fetchSellerReviewsAction.pending, (state) => {
        state.apiName = 'seller/fetchReviews';
        state.loading = 'seller/fetchReviews';
      })
      .addCase(fetchSellerReviewsAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.sellerReviews = payload;
        state.alertType = 'success';
        state.message = payload?.message || '';
      })
      .addCase(fetchSellerReviewsAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) state.message = payload.message;
      })

      .addCase(deleteSellerReviewAction.pending, (state) => {
        state.apiName = 'seller/deleteReview';
        state.loading = 'seller/deleteReview';
      })
      .addCase(deleteSellerReviewAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.sellerReviews = state.sellerReviews.filter((r) => r.id !== payload);
        state.alertType = 'success';
        state.message = 'Seller review deleted';
      })
      .addCase(deleteSellerReviewAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) state.message = payload.message;
      });
  },
});

export const { clearReviewState } = reviewSlice.actions;
export default reviewSlice.reducer;
