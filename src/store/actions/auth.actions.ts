import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/libs/axios';
import type { APISuccessResponse } from '@/libs/axios';
import type { IUser } from '@/types/user.types';

export const signUpUserAction = createAsyncThunk<
  APISuccessResponse,     
  FormData                
>('auth/signUpUser', async (formData: FormData, thunkAPI) => {
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
});

export const signInUserAction = createAsyncThunk<
  APISuccessResponse,  
  IUser                
>('auth/signInUser', async (credentials: IUser, thunkAPI) => {
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
});

interface ForgotPasswordPayload {
  email: string;
  role: string;
}

export const forgotPasswordAction = createAsyncThunk<
  APISuccessResponse,          
  ForgotPasswordPayload        
>('auth/forgotPassword', async ({ email, role }: ForgotPasswordPayload, thunkAPI) => {
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
});
