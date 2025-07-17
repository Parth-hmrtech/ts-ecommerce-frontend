import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/libs/axios';
import type { APISuccessResponse } from '@/libs/axios';
import type { IPayment  } from '@/types/payment.types';

const BASE_URL = '/buyer/payments';

const getTokenHeader = () => {
  const token = localStorage.getItem('access_token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

const buyerCheckoutPaymentAction = createAsyncThunk<APISuccessResponse, IPayment>(
  'buyerPayment/checkout',
  async ({ order_id, seller_id, amount, payment_method, transaction_id }, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: `${BASE_URL}/checkout`,
        data: {
          order_id,
          seller_id,
          amount,
          payment_method,
          transaction_id,
        },
        headers: getTokenHeader(),
      });
      return thunkAPI.fulfillWithValue(response.data?.data || []);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(new Error(error?.response?.data?.message || 'Something is wrong here'));
    }
  }
);

const buyerVerifyPaymentAction = createAsyncThunk<APISuccessResponse, IPayment>(
  'buyerPayment/verify',
  async ({ status, transaction_id }, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: `${BASE_URL}/verify`,
        data: { status, transaction_id },
        headers: getTokenHeader(),
      });
      return thunkAPI.fulfillWithValue(response.data?.data || []);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(new Error(error?.response?.data?.message || 'Something is wrong here'));
    }
  }
);

const buyerCheckPaymentStatusAction = createAsyncThunk<APISuccessResponse, void>(
  'buyerPayment/checkStatus',
  async (_, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: `${BASE_URL}/status`,
        headers: getTokenHeader(),
      });
      return thunkAPI.fulfillWithValue(response.data?.data || []);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(new Error(error?.response?.data?.message || 'Something is wrong here'));
    }
  }
);

const fetchSellerPaymentsAction = createAsyncThunk<APISuccessResponse, void>(
  'payments/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: '/seller/payments',
        headers: getTokenHeader(),
      });
      return thunkAPI.fulfillWithValue(response.data?.data || []);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(new Error(error?.response?.data?.message || 'Something is wrong here'));
    }
  }
);

const fetchSellerEarningsAction = createAsyncThunk<APISuccessResponse, void>(
  'earnings/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: '/seller/earnings',
        headers: getTokenHeader(),
      });
      return thunkAPI.fulfillWithValue(response.data?.data || []);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(new Error(error?.response?.data?.message || 'Something is wrong here'));
    }
  }
);

export {
  buyerCheckoutPaymentAction,
  buyerVerifyPaymentAction,
  buyerCheckPaymentStatusAction,
  fetchSellerPaymentsAction,
  fetchSellerEarningsAction,
};
