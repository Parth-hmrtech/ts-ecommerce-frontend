import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/libs/axios';
import type { APISuccessResponse } from '@/libs/axios';
import type { IOrder } from '@/types/order.types';

const getTokenHeader = () => {
  const token = localStorage.getItem('access_token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

const placeBuyerOrderAction = createAsyncThunk<APISuccessResponse, IOrder>(
  'buyerOrder/placeBuyerOrder',
  async ({ products, delivery_address }, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: '/buyer/orders',
        data: { products, delivery_address },
        headers: getTokenHeader(),
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(new Error(error?.response?.data?.message || 'Something is wrong here'));
    }
  }
);

const fetchBuyerOrdersAction = createAsyncThunk<APISuccessResponse, void>(
  'buyerOrder/fetchBuyerOrders',
  async (_, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: '/buyer/orders',
        headers: getTokenHeader(),
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(new Error(error?.response?.data?.message || 'Something is wrong here'));
    }
  }
);

const fetchBuyerOrderByIdAction = createAsyncThunk<APISuccessResponse, string>(
  'buyerOrder/fetchBuyerOrderById',

  async (orderId, thunkAPI) => {

    try {
      const response = await apiRequest({
        method: 'GET',
        url: `/buyer/orders/${orderId}`,
        headers: getTokenHeader(),
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(new Error(error?.response?.data?.message || 'Something is wrong here'));
    }
  }
);

const updateBuyerOrderAddressAction = createAsyncThunk<APISuccessResponse, IOrder>(
  'buyerOrder/updateBuyerOrderAddress',
  async ({ orderId, delivery_address }, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: 'PUT',
        url: `/buyer/orders/${orderId}/update-address`,
        data: { delivery_address },
        headers: getTokenHeader(),
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(new Error(error?.response?.data?.message || 'Something is wrong here'));
    }
  }
);

const deleteBuyerOrderAction = createAsyncThunk<APISuccessResponse, IOrder>(
  'buyerOrder/deleteBuyerOrder',
  async (orderId, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: 'DELETE',
        url: `/buyer/orders/${orderId}`,
        headers: getTokenHeader(),
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(new Error(error?.response?.data?.message || 'Something is wrong here'));
    }
  }
);

const fetchSellerOrdersAction = createAsyncThunk<APISuccessResponse, void>(
  'orders/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: '/seller/orders',
        headers: getTokenHeader(),
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(new Error(error?.response?.data?.message || 'Something is wrong here'));
    }
  }
);

const updateOrderStatusAction = createAsyncThunk<APISuccessResponse, IOrder>(
  'orders/updateStatus',
  async ({ orderId, status }, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: 'PUT',
        url: `/seller/orders/${orderId}/status`,
        data: { status },
        headers: getTokenHeader(),
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(new Error(error?.response?.data?.message || 'Something is wrong here'));
    }
  }
);

export {
  placeBuyerOrderAction,
  fetchBuyerOrdersAction,
  fetchBuyerOrderByIdAction,
  updateBuyerOrderAddressAction,
  deleteBuyerOrderAction,
  fetchSellerOrdersAction,
  updateOrderStatusAction,
};
