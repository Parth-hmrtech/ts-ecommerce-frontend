import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/libs/axios';
import type { APISuccessResponse } from '@/libs/axios';
import type { IUser } from '@/types/user.types';

// Sign Up Action (FormData type because of file uploads)
export const signUpUserAction = createAsyncThunk<
  APISuccessResponse,       // Return type
  FormData                  // Argument type
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

// Sign In Action (with IUser type)
export const signInUserAction = createAsyncThunk<
  APISuccessResponse,      // Return type
  IUser                    // Argument type
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

// Forgot Password Action (custom payload type)
interface ForgotPasswordPayload {
  email: string;
  role: string;
}

export const forgotPasswordAction = createAsyncThunk<
  APISuccessResponse,            // Return type
  ForgotPasswordPayload          // Argument type
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
