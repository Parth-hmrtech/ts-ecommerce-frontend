import { createSlice } from '@reduxjs/toolkit';
import {
  buyerCheckoutPaymentAction,
  buyerVerifyPaymentAction,
  buyerCheckPaymentStatusAction,
  fetchSellerPaymentsAction,
  fetchSellerEarningsAction,
} from '@/store/actions/payment.action';

const initialState = {
  buyerPayment: null,
  paymentStatus: null,
  sellerPayments: [],
  sellerEarnings: [],
  loading: '',
  apiName: '',
  alertType: '',
  message: '',
  error: false,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearPaymentState: (state) => {
      state.loading = '';
      state.apiName = '';
      state.alertType = '';
      state.message = '';
      state.error = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(buyerCheckoutPaymentAction.pending, (state) => {
      state.apiName = 'buyerPayment/checkout';
      state.loading = 'buyerPayment/checkout';
    });
    builder.addCase(buyerCheckoutPaymentAction.fulfilled, (state, { payload }) => {
      state.loading = '';
      state.buyerPayment = payload;
      state.alertType = 'success';
      state.message = 'Payment checkout successful';
    });
    builder.addCase(buyerCheckoutPaymentAction.rejected, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'error';
      if (payload) state.message = payload;
    });

    builder.addCase(buyerVerifyPaymentAction.pending, (state) => {
      state.apiName = 'buyerPayment/verify';
      state.loading = 'buyerPayment/verify';
    });
    builder.addCase(buyerVerifyPaymentAction.fulfilled, (state, { payload }) => {
      state.loading = '';
      state.buyerPayment = payload;
      state.alertType = 'success';
      state.message = 'Payment verified';
    });
    builder.addCase(buyerVerifyPaymentAction.rejected, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'error';
      if (payload) state.message = payload;
    });

    builder.addCase(buyerCheckPaymentStatusAction.pending, (state) => {
      state.apiName = 'buyerPayment/checkStatus';
      state.loading = 'buyerPayment/checkStatus';
    });
    builder.addCase(buyerCheckPaymentStatusAction.fulfilled, (state, { payload }) => {
      state.loading = '';
      state.buyerPayment = payload;      
      state.alertType = 'success';
      state.message = 'Payment status fetched';
    });
    builder.addCase(buyerCheckPaymentStatusAction.rejected, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'error';
      if (payload) state.message = payload;
    });

    builder.addCase(fetchSellerPaymentsAction.pending, (state) => {
      state.apiName = 'seller/fetchPayments';
      state.loading = 'seller/fetchPayments';
    });
    builder.addCase(fetchSellerPaymentsAction.fulfilled, (state, { payload }) => {
      state.loading = '';
      state.sellerPayments = payload;
      state.alertType = 'success';
      state.message = 'Seller payments fetched';
    });
    builder.addCase(fetchSellerPaymentsAction.rejected, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'error';
      if (payload) state.message = payload;
    });

    builder.addCase(fetchSellerEarningsAction.pending, (state) => {
      state.apiName = 'seller/fetchEarnings';
      state.loading = 'seller/fetchEarnings';
    });
    builder.addCase(fetchSellerEarningsAction.fulfilled, (state, { payload }) => {
      state.loading = '';
      state.sellerEarnings = payload;
      state.alertType = 'success';
      state.message = 'Earnings fetched';
    });
    builder.addCase(fetchSellerEarningsAction.rejected, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'error';
      if (payload) state.message = payload;
    });
  },
});

export const { clearPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
