import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/libs/axios';
import type { APISuccessResponse } from '@/libs/axios';
import type { IReview, IReviewAdd } from '@/types/review.types';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

const fetchBuyerReviewByProductIdAction = createAsyncThunk<APISuccessResponse, string>(
  'buyerReview/fetchByProductId',
  async (productId, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: `/buyer/reviews/${productId}`,
        headers: getAuthHeaders(),
      });
      return thunkAPI.fulfillWithValue(response.data.data || []);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        new Error(error?.response?.data?.message || 'Something is wrong here')
      );
    }
  }
);

const addBuyerReviewAction = createAsyncThunk<APISuccessResponse, IReviewAdd>(
  'buyerReview/add',
  async (reviewData, thunkAPI) => {
    try {
      const { product_id, order_id, buyer_id, seller_id, rating, comment } = reviewData;
      const response = await apiRequest({
        method: 'POST',
        url: '/buyer/review',
        data: { product_id, order_id, buyer_id, seller_id, rating, comment },
        headers: getAuthHeaders(),
      });
      return thunkAPI.fulfillWithValue(response.data.data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        new Error(error?.response?.data?.message || 'Something is wrong here')
      );
    }
  }
);

const updateBuyerReviewAction = createAsyncThunk<APISuccessResponse, IReview>(
  'buyerReview/update',
  async ({ id, rating, comment }, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: 'PUT',
        url: `/buyer/reviews/${id}`,
        data: { rating, comment },
        headers: getAuthHeaders(),
      });
      return thunkAPI.fulfillWithValue(response.data.data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        new Error(error?.response?.data?.message || 'Something is wrong here')
      );
    }
  }
);

const deleteBuyerReviewAction = createAsyncThunk<string, string>(
  'buyerReview/delete',
  async (id, thunkAPI) => {
    try {
      await apiRequest({
        method: 'DELETE',
        url: `/buyer/reviews/${id}`,
        headers: getAuthHeaders(),
      });
      return thunkAPI.fulfillWithValue(id);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        new Error(error?.response?.data?.message || 'Something is wrong here')
      );
    }
  }
);

const fetchSellerReviewsAction = createAsyncThunk<APISuccessResponse, void>(
  'seller/fetchReviews',
  async (_, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: '/seller/reviews/',
        headers: getAuthHeaders(),
      });
      return thunkAPI.fulfillWithValue(response.data.data || []);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        new Error(error?.response?.data?.message || 'Something is wrong here')
      );
    }
  }
);

const deleteSellerReviewAction = createAsyncThunk<string, string>(
  'seller/deleteReview',
  async (reviewId, thunkAPI) => {
    try {
      await apiRequest({
        method: 'DELETE',
        url: `/seller/reviews/${reviewId}`,
        headers: getAuthHeaders(),
      });
      return thunkAPI.fulfillWithValue(reviewId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        new Error(error?.response?.data?.message || 'Something is wrong here')
      );
    }
  }
);

export {
  fetchBuyerReviewByProductIdAction,
  addBuyerReviewAction,
  updateBuyerReviewAction,
  deleteBuyerReviewAction,
  fetchSellerReviewsAction,
  deleteSellerReviewAction,
};
