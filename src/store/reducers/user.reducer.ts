import { createSlice } from '@reduxjs/toolkit';
import {
  fetchUserProfileAction,
  updateUserProfileAction,
  resetUserPasswordAction,
} from '@/store/actions/user.action';
import type { IUser } from '@/types/user.types';

interface IUserState {
  profile: IUser | null;
  loading: string;
  apiName: string;
  alertType: '' | 'success' | 'error';
  message: string;
  error: boolean;
}

const initialState: IUserState = {
  profile: null,
  loading: '',
  apiName: '',
  alertType: '',
  message: '',
  error: false,
};

const userSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    clearUserState: (state) => {
      state.loading = '';
      state.apiName = '';
      state.alertType = '';
      state.message = '';
      state.error = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserProfileAction.pending, (state) => {
      state.apiName = 'userProfile/fetch';
      state.loading = 'userProfile/fetch';
    });
    builder.addCase(fetchUserProfileAction.fulfilled, (state, { payload }: any) => {
      state.loading = '';
      state.profile = payload.data ?? payload;
      state.alertType = 'success';
      state.message = payload.message ?? '';
      state.error = false;
    });
    builder.addCase(fetchUserProfileAction.rejected, (state, { payload }: any) => {
      state.loading = '';
      state.alertType = 'error';
      if (payload && payload.message) {
        state.message = payload.message;
      } else {
        state.message = 'Failed to fetch user profile';
      }
      state.error = true;
    });

    builder.addCase(updateUserProfileAction.pending, (state) => {
      state.apiName = 'userProfile/update';
      state.loading = 'userProfile/update';
    });
    builder.addCase(updateUserProfileAction.fulfilled, (state, { payload }: any) => {
      state.loading = '';
      state.profile = payload.data ?? payload;
      state.alertType = 'success';
      state.message = payload.message ?? '';
      state.error = false;
    });
    builder.addCase(updateUserProfileAction.rejected, (state, { payload }: any) => {
      state.loading = '';
      state.alertType = 'error';
      if (payload && payload.message) {
        state.message = payload.message;
      } else {
        state.message = 'Failed to update user profile';
      }
      state.error = true;
    });

    builder.addCase(resetUserPasswordAction.pending, (state) => {
      state.apiName = 'userProfile/resetPassword';
      state.loading = 'userProfile/resetPassword';
    });
    builder.addCase(resetUserPasswordAction.fulfilled, (state, { payload }: any) => {
      state.loading = '';
      state.alertType = 'success';
      state.message = payload.message ?? '';
      state.error = false;
    });
    builder.addCase(resetUserPasswordAction.rejected, (state, { payload }: any) => {
      state.loading = '';
      state.alertType = 'error';
      if (payload && payload.message) {
        state.message = payload.message;
      } else {
        state.message = 'Failed to reset password';
      }
      state.error = true;
    });
  },
});

export const { clearUserState } = userSlice.actions;
export default userSlice.reducer;
