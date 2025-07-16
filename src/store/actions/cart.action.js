import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/libs/axios';

const BASE_ENDPOINT = '/buyer/cart';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

const fetchBuyerCartAction = createAsyncThunk(
  'buyerCart/fetch',
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: BASE_ENDPOINT,
        headers: getAuthHeaders(),
      });

      if (response?.status !== 200) {
        return rejectWithValue(new Error('Something went wrong'));
      }
      
      return fulfillWithValue(response?.data?.data || []);
    } catch (error) {
        new Error(error?.data?.message || "Something is wrong here")
    }
  }
);

const addToBuyerCartAction = createAsyncThunk(
  'buyerCart/add',
  async ({ product_id, quantity }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: BASE_ENDPOINT,
        headers: getAuthHeaders(),
        data: { product_id, quantity },
      });

      if (response?.status !== 200) {
        return rejectWithValue(new Error('Something went wrong'));
      }

      return fulfillWithValue(response?.data?.data);
    } catch (error) {
        new Error(error?.data?.message || "Something is wrong here")
    }
  }
);

const updateBuyerCartAction = createAsyncThunk(
  'buyerCart/update',
  async ({ id, quantity }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await apiRequest({
        method: 'PUT',
        url: `${BASE_ENDPOINT}/${id}`,
        headers: getAuthHeaders(),
        data: { quantity: String(quantity) },
      });

      if (response?.status !== 200) {
        return rejectWithValue(new Error('Something went wrong'));
      }

      return fulfillWithValue(response?.data?.data);
    } catch (error) {
        new Error(error?.data?.message || "Something is wrong here")
    }
  }
);

const deleteBuyerCartAction = createAsyncThunk(
  'buyerCart/deleteItem',
  async (id, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await apiRequest({
        method: 'DELETE',
        url: `${BASE_ENDPOINT}/${id}`,
        headers: getAuthHeaders(),
      });

      if (response?.status !== 200) {
        return rejectWithValue(new Error('Something went wrong'));
      }

      return fulfillWithValue(response?.data?.data);
    } catch (error) {
        new Error(error?.data?.message || "Something is wrong here")
    }
  }
);

const deleteBuyerIdCartAction = createAsyncThunk(
  'buyerCart/deleteAllByBuyerId',
  async (buyerId, { fulfillWithValue, rejectWithValue }) => {
    try {   
         
      const response = await apiRequest({
        method: 'DELETE',
        url: `${BASE_ENDPOINT}/buyerId/${buyerId}`,
        headers: getAuthHeaders(),
      });

      if (response?.status !== 200 || response?.data?.success === false) {
        return rejectWithValue(new Error('Something went wrong'));
      }

      return fulfillWithValue(response?.data?.data);
    } catch (error) {
        new Error(error?.data?.message || "Something is wrong here")
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
