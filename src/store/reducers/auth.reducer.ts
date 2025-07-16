import { createSlice } from '@reduxjs/toolkit';
import {
  signUpUserAction,
  signInUserAction,
  forgotPasswordAction,
} from '@/store/actions/auth.actions';
import type { IUser } from '@/types/user.types';

interface AuthState {
  user: IUser | null;
  loading: string;
  error: boolean;
  message: string;
  apiName: string;
  alertType: string;
  success: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: '',
  error: false,
  message: '',
  apiName: '',
  alertType: '',
  success: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthMessage: (state) => {
      state.alertType = '';
      state.apiName = '';
      state.message = '';
      state.error = false;
    },
    setAuthError: (state, action) => {
      const { alertType, apiName, message } = action.payload;
      state.alertType = alertType;
      state.apiName = apiName;
      state.message = message;
      state.error = true;
    },
    resetAuthState: (state) => {
      state.user = null;
      state.loading = '';
      state.error = false;
      state.message = '';
      state.apiName = '';
      state.alertType = '';
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signUpUserAction.pending, (state) => {
      state.apiName = 'auth/signUp';
      state.loading = 'auth/signUp';
      state.success = false;
      state.error = false;
    });
    builder.addCase(signUpUserAction.fulfilled, (state, { payload }: any) => {
      state.loading = '';
      state.success = true;
      state.error = false;
      state.alertType = 'success';
      state.message = payload.message;
      state.user = payload.data.user;
    });
    builder.addCase(signUpUserAction.rejected, (state, { payload }: any) => {
      state.loading = '';
      state.success = false;
      state.error = true;
      state.alertType = 'error';
      state.message = payload?.message || 'Something went wrong';
    });

    builder.addCase(signInUserAction.pending, (state) => {
      state.apiName = 'auth/signIn';
      state.loading = 'auth/signIn';
      state.success = false;
      state.error = false;
    });
    builder.addCase(signInUserAction.fulfilled, (state, { payload }: any) => {
      state.loading = '';
      state.success = true;
      state.error = false;
      state.alertType = 'success';
      state.message = payload.message;
      state.user = payload.data.user;
      localStorage.setItem('user', JSON.stringify(payload.data.user));
      localStorage.setItem('access_token', payload.data.token);
    });
    builder.addCase(signInUserAction.rejected, (state, { payload }: any) => {
      state.loading = '';
      state.success = false;
      state.error = true;
      state.alertType = 'error';
      state.message = payload?.message || 'Something went wrong';
    });

    builder.addCase(forgotPasswordAction.pending, (state) => {
      state.apiName = 'auth/forgotPassword';
      state.loading = 'auth/forgotPassword';
      state.success = false;
      state.error = false;
    });
    builder.addCase(forgotPasswordAction.fulfilled, (state, { payload }: any) => {
      state.loading = '';
      state.success = true;
      state.error = false;
      state.alertType = 'success';
      state.message = payload.message;
    });
    builder.addCase(forgotPasswordAction.rejected, (state, { payload }: any) => {
      state.loading = '';
      state.success = false;
      state.error = true;
      state.alertType = 'error';
      state.message = payload?.message || 'Something went wrong';
    });
  },
});

export const {
  clearAuthMessage,
  setAuthError,
  resetAuthState,
} = authSlice.actions;

export default authSlice.reducer;
