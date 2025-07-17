import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/libs/axios';
import type { APISuccessResponse } from '@/libs/axios';
import type { IUser } from '@/types/user.types';

  const signUpUserAction = createAsyncThunk<APISuccessResponse, FormData>(
    'auth/signUpUser',
    async (formData, thunkAPI) => {
      try {
        const response = await apiRequest({
          method: 'POST',
          url: '/auth/register',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return thunkAPI.fulfillWithValue(response.data);
      } catch (error: any) {
        return thunkAPI.rejectWithValue(
          new Error(error?.response?.data?.message || 'Something is wrong here')
        );
      }
    }
  );

const signInUserAction = createAsyncThunk<APISuccessResponse, IUser>(
  'auth/signInUser',
  async (credentials, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: '/auth/login',
        data: credentials,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        new Error(error?.response?.data?.message || 'Something is wrong here')
      );  
    }
  }
);

const forgotPasswordAction = createAsyncThunk<
  APISuccessResponse,
  { email: string; role: string }
>(
  'auth/forgotPassword',
  async ({ email, role }, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: '/auth/forgot-password',
        data: { email, role },
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        new Error(error?.response?.data?.message || 'Something is wrong here')
      );
    }
  }
);

export {
  signUpUserAction,
  signInUserAction,
  forgotPasswordAction,
};
