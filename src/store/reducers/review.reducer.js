import { createSlice } from '@reduxjs/toolkit';
import {
  fetchBuyerReviewByProductIdAction,
  addBuyerReviewAction,
  updateBuyerReviewAction,
  deleteBuyerReviewAction,
  fetchSellerReviewsAction,
  deleteSellerReviewAction,
} from '@/store/actions/review.action';

const initialState = {
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
    builder.addCase(fetchBuyerReviewByProductIdAction.pending, (state) => {
      state.apiName = 'buyerReview/fetchByProductId';
      state.loading = 'buyerReview/fetchByProductId';
    });
    builder.addCase(fetchBuyerReviewByProductIdAction.fulfilled, (state, { payload }) => {
      state.loading = '';
      state.buyerReviews = payload;      
      state.alertType = 'success';
      state.message = 'Buyer reviews fetched';
    });
    builder.addCase(fetchBuyerReviewByProductIdAction.rejected, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'error';
      if (payload) state.message = payload;
    });

    builder.addCase(addBuyerReviewAction.pending, (state) => {
      state.apiName = 'buyerReview/add';
      state.loading = 'buyerReview/add';
    });
    builder.addCase(addBuyerReviewAction.fulfilled, (state, { payload }) => {
      state.loading = '';
      state.buyerReviews.push(payload);
      state.alertType = 'success';
      state.message = 'Review added';
    });
    builder.addCase(addBuyerReviewAction.rejected, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'error';
      if (payload) state.message = payload;
    });

    builder.addCase(updateBuyerReviewAction.pending, (state) => {
      state.apiName = 'buyerReview/update';
      state.loading = 'buyerReview/update';
    });
    builder.addCase(updateBuyerReviewAction.fulfilled, (state, { payload }) => {
      state.loading = '';
      state.buyerReviews = state.buyerReviews.map((review) =>
        review._id === payload._id ? payload : review
      );
      state.alertType = 'success';
      state.message = 'Review updated';
    });
    builder.addCase(updateBuyerReviewAction.rejected, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'error';
      if (payload) state.message = payload;
    });

    builder.addCase(deleteBuyerReviewAction.pending, (state) => {
      state.apiName = 'buyerReview/delete';
      state.loading = 'buyerReview/delete';
    });
    builder.addCase(deleteBuyerReviewAction.fulfilled, (state, { payload }) => {
      state.loading = '';
      state.buyerReviews = state.buyerReviews.filter((r) => r._id !== payload._id);
      state.alertType = 'success';
      state.message = 'Review deleted';
    });
    builder.addCase(deleteBuyerReviewAction.rejected, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'error';
      if (payload) state.message = payload;
    });

    builder.addCase(fetchSellerReviewsAction.pending, (state) => {
      state.apiName = 'seller/fetchReviews';
      state.loading = 'seller/fetchReviews';
    });
    builder.addCase(fetchSellerReviewsAction.fulfilled, (state, { payload }) => {
      state.loading = '';
      state.sellerReviews = payload;
      state.alertType = 'success';
      state.message = payload?.message ;
    });
    builder.addCase(fetchSellerReviewsAction.rejected, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'error';
      if (payload) state.message = payload;
    });

    builder.addCase(deleteSellerReviewAction.pending, (state) => {
      state.apiName = 'seller/deleteReview';
      state.loading = 'seller/deleteReview';
    });
    builder.addCase(deleteSellerReviewAction.fulfilled, (state, { payload }) => {
      state.loading = '';
      state.sellerReviews = state.sellerReviews.filter((r) => r._id !== payload);
      state.alertType = 'success';
      state.message = 'Seller review deleted';
    });
    builder.addCase(deleteSellerReviewAction.rejected, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'error';
      if (payload) state.message = payload;
    });
  },
});

export const { clearReviewState } = reviewSlice.actions;
export default reviewSlice.reducer;
