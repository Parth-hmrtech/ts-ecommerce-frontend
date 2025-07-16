import { createSlice } from '@reduxjs/toolkit';
import {
  fetchUserProfileAction,
  updateUserProfileAction,
  resetUserPasswordAction,
} from '@/store/actions/user.action';

const initialState = {
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
    builder.addCase(fetchUserProfileAction.fulfilled, (state, { payload }) => {
      state.loading = '';
      state.profile = payload;
      state.alertType = 'success';
      state.message = payload?.message ;
      state.error = false;
    });
    builder.addCase(fetchUserProfileAction.rejected, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'error';
      state.message = payload ;
      state.error = true;
    });

    builder.addCase(updateUserProfileAction.pending, (state) => {
      state.apiName = 'userProfile/update';
      state.loading = 'userProfile/update';
    });
    builder.addCase(updateUserProfileAction.fulfilled, (state, { payload }) => {
      state.loading = '';
      state.profile = payload;
      state.alertType = 'success';
      state.message = payload?.message ;
      state.error = false;
    });
    builder.addCase(updateUserProfileAction.rejected, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'error';
      state.message = payload;
      state.error = true;
    });

    builder.addCase(resetUserPasswordAction.pending, (state) => {
      state.apiName = 'userProfile/resetPassword';
      state.loading = 'userProfile/resetPassword';
    });
    builder.addCase(resetUserPasswordAction.fulfilled, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'success';
      state.message = payload?.message ;
      state.error = false;
    });
    builder.addCase(resetUserPasswordAction.rejected, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'error';
      state.message = payload ;
      state.error = true;
    });
  },
});

export const { clearUserState } = userSlice.actions;
export default userSlice.reducer;
