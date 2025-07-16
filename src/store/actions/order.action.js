import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/libs/axios';

const getTokenHeader = () => {
  const token = localStorage.getItem('access_token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

const placeBuyerOrderAction = createAsyncThunk(
  'buyerOrder/placeBuyerOrder',
  async ({ products, delivery_address }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: '/buyer/orders',
        data: { products, delivery_address },
        headers: getTokenHeader(),
      });
      return fulfillWithValue(response.data?.data || []);
    } catch (error) {
      return rejectWithValue('Something is wrong here');
    }
  }
);

const fetchBuyerOrdersAction = createAsyncThunk(
  'buyerOrder/fetchBuyerOrders',
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: '/buyer/orders',
        headers: getTokenHeader(),
      });
      return fulfillWithValue(response.data?.data || []);
    } catch (error) {
      return rejectWithValue('Something is wrong here');
    }
  }
);

const fetchBuyerOrderByIdAction = createAsyncThunk(
  'buyerOrder/fetchBuyerOrderById',
  async (orderId, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: `/buyer/orders/${orderId}`,
        headers: getTokenHeader(),
      });
      return fulfillWithValue(response.data?.data || []);
    } catch (error) {
      return rejectWithValue('Something is wrong here');
    }
  }
);

const updateBuyerOrderAddressAction = createAsyncThunk(
  'buyerOrder/updateBuyerOrderAddress',
  async ({ orderId, delivery_address }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await apiRequest({
        method: 'PUT',
        url: `/buyer/orders/${orderId}/update-address`,
        data: { delivery_address },
        headers: getTokenHeader(),
      });
      return fulfillWithValue(response.data?.data || []);
    } catch (error) {
      return rejectWithValue('Something is wrong here');
    }
  }
);

const deleteBuyerOrderAction = createAsyncThunk(
  'buyerOrder/deleteBuyerOrder',
  async (orderId, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await apiRequest({
        method: 'DELETE',
        url: `/buyer/orders/${orderId}`,
        headers: getTokenHeader(),
      });
      return fulfillWithValue(response.data?.data || []);
    } catch (error) {
      return rejectWithValue('Something is wrong here');
    }
  }
);

const fetchSellerOrdersAction = createAsyncThunk(
  'orders/fetchAll',
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: '/seller/orders',
        headers: getTokenHeader(),
      });
      return fulfillWithValue(response.data?.data || []);
    } catch (error) {
      return rejectWithValue('Something is wrong here');
    }
  }
);

const updateOrderStatusAction = createAsyncThunk(
  'orders/updateStatus',
  async ({ orderId, status }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await apiRequest({
        method: 'PUT',
        url: `/seller/orders/${orderId}/status`,
        data: { status },
        headers: getTokenHeader(),
      });
      return fulfillWithValue(response.data?.data || []);
    } catch (error) {
      return rejectWithValue('Something is wrong here');
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
