import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/libs/axios';
import type { APISuccessResponse } from '@/libs/axios';
import type { IUser } from '@/types/user.types';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

const fetchUserProfileAction = createAsyncThunk<APISuccessResponse, void>(
  'userProfile/fetch',
  async (_, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: '/profile',
        headers: getAuthHeaders(),
      });

      return thunkAPI.fulfillWithValue(response.data?.data || {});
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        new Error(error?.response?.data?.message || 'Something is wrong here')
      );
    }
  }
);

const updateUserProfileAction = createAsyncThunk<APISuccessResponse, IUser>(
  'userProfile/update',
  async ({ id, ...rest }, thunkAPI) => {
    try {
      const data = rest as Partial<IUser> | FormData;

      const response = await apiRequest({
        method: 'PUT',
        url: `/profile/${id}`,
        data,
        headers: {
          ...getAuthHeaders(),
          ...(data instanceof FormData && { 'Content-Type': 'multipart/form-data' }),
        },
      });

      return thunkAPI.fulfillWithValue(response.data?.data || {});
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        new Error(error?.response?.data?.message || 'Something is wrong here')
      );
    }
  }
);


const resetUserPasswordAction = createAsyncThunk<APISuccessResponse, IUser>(
  'userProfile/resetPassword',
  async ({ oldPassword, newPassword }, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: '/reset-password',
        data: { oldPassword, newPassword },
        headers: getAuthHeaders(),
      });

      return thunkAPI.fulfillWithValue(response.data || {});
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        new Error(error?.response?.data?.message || 'Something is wrong here')
      );
    }
  }
);

export {
  fetchUserProfileAction,
  updateUserProfileAction,
  resetUserPasswordAction,
};
