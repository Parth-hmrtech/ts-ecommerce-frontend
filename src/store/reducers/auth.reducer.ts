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
  clearMessage: (state) => {
      state.alertType = '';
      state.apiName = '';
      state.message = '';
      state.error = false;
    },
    errorMessage: (state, action) => {
      const { alertType, apiName, message } = action.payload;
      state.alertType = alertType;
      state.apiName = apiName;
      state.message = message;
      state.error = true;
    },
    resetAuth: (state) => {
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
      state.alertType = 'error';
      if (payload) {
        state.message = payload.message;
      }
    });

    builder.addCase(signInUserAction.pending, (state) => {
      state.apiName = 'auth/signIn';
      state.loading = 'auth/signIn';
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
      state.alertType = 'error';
      if (payload) {
        state.message = payload.message;
      }
    });

    builder.addCase(forgotPasswordAction.pending, (state) => {
      state.apiName = 'auth/forgotPassword';
      state.loading = 'auth/forgotPassword';
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
      state.alertType = 'error';
      if (payload) {
        state.message = payload.message;
      }
    });
  },
});

export const { clearMessage, errorMessage, resetAuth } = authSlice.actions;
export default authSlice.reducer;
