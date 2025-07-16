import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/libs/axios';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

const fetchUserProfileAction = createAsyncThunk(
  'userProfile/fetch',
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: '/profile',
        headers: getAuthHeaders(),
      });
      return fulfillWithValue(response.data?.data || {});
    } catch (error) {
      return rejectWithValue('Failed to fetch user profile');
    }
  }
);

const updateUserProfileAction = createAsyncThunk(
  'userProfile/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apiRequest({
        method: 'PUT',
        url: `/profile/${id}`,
        data,
        headers: {
          ...getAuthHeaders(),
          ...(data instanceof FormData && { 'Content-Type': 'multipart/form-data' }),
        },
      });

      if (response.status !== 200) {
        throw new Error('Update failed');
      }

      return response || {};
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error.message || 'Failed to update profile'
      );
    }
  }
);

const resetUserPasswordAction = createAsyncThunk(
  'userProfile/resetPassword',
  async ({ oldPassword, newPassword }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: '/reset-password',
        data: { oldPassword, newPassword },
        headers: getAuthHeaders(),
      });
      return fulfillWithValue(response.data || {});
    } catch (error) {
      return rejectWithValue('Failed to reset password');
    }
  }
);

export {
  fetchUserProfileAction,
  updateUserProfileAction,
  resetUserPasswordAction,
};
