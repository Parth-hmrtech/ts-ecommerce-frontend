import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/libs/axios';
import type { APISuccessResponse } from '@/libs/axios';

const BASE_ENDPOINT = '/buyer/cart';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

const fetchBuyerCartAction = createAsyncThunk<APISuccessResponse, void>(
  'buyerCart/fetch',
  async (_, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: BASE_ENDPOINT,
        headers: getAuthHeaders(),
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(new Error(error?.response?.data?.message || 'Something is wrong here'));
    }
  }
);

const addToBuyerCartAction = createAsyncThunk<
  APISuccessResponse,
  { product_id: string; quantity: number }
>(
  'buyerCart/add',
  async ({ product_id, quantity }, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: BASE_ENDPOINT,
        headers: getAuthHeaders(),
        data: { product_id, quantity },
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(new Error(error?.response?.data?.message || 'Something is wrong here'));
    }
  }
);

const updateBuyerCartAction = createAsyncThunk<
  APISuccessResponse,
  { id: string; quantity: number }
>(
  'buyerCart/update',
  async ({ id, quantity }, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: 'PUT',
        url: `${BASE_ENDPOINT}/${id}`,
        headers: getAuthHeaders(),
        data: { quantity },
      });      
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(new Error(error?.response?.data?.message || 'Something is wrong here'));
    }
  }
);

const deleteBuyerCartAction = createAsyncThunk<
  APISuccessResponse,
  string
>(
  'buyerCart/deleteItem',
  async (id, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: 'DELETE',
        url: `${BASE_ENDPOINT}/${id}`,
        headers: getAuthHeaders(),
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(new Error(error?.response?.data?.message || 'Something is wrong here'));
    }
  }
);

const deleteBuyerIdCartAction = createAsyncThunk<
  APISuccessResponse,
  string
>(
  'buyerCart/deleteAllByBuyerId',
  async (buyerId, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: 'DELETE',
        url: `${BASE_ENDPOINT}/buyerId/${buyerId}`,
        headers: getAuthHeaders(),
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(new Error(error?.response?.data?.message || 'Something is wrong here'));
    }
  }
);

export {
  fetchBuyerCartAction,
  addToBuyerCartAction,
  updateBuyerCartAction,
  deleteBuyerCartAction,
  deleteBuyerIdCartAction,
};
