import { createSlice } from '@reduxjs/toolkit';
import {
  buyerCheckoutPaymentAction,
  buyerVerifyPaymentAction,
  buyerCheckPaymentStatusAction,
  fetchSellerPaymentsAction,
  fetchSellerEarningsAction,
} from '@/store/actions/payment.action';

import type { IPayment } from '@/types/payment.types';

interface PaymentState {
  buyerPayment: IPayment | null;
  paymentStatus: IPayment | null;
  sellerPayments: IPayment[];
  sellerEarnings: IPayment[];  
  loading: string;
  apiName: string;
  alertType: 'success' | 'error' | '';
  message: string;
  error: boolean;
}


const initialState: PaymentState = {
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
    builder
      .addCase(buyerCheckoutPaymentAction.pending, (state) => {
        state.apiName = 'buyerPayment/checkout';
        state.loading = 'buyerPayment/checkout';
      })
      .addCase(buyerCheckoutPaymentAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.buyerPayment = payload;
        state.alertType = 'success';
        state.message = 'Payment checkout successful';
      })
      .addCase(buyerCheckoutPaymentAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) state.message = payload;
      })

      .addCase(buyerVerifyPaymentAction.pending, (state) => {
        state.apiName = 'buyerPayment/verify';
        state.loading = 'buyerPayment/verify';
      })
      .addCase(buyerVerifyPaymentAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.buyerPayment = payload;
        state.alertType = 'success';
        state.message = 'Payment verified';
      })
      .addCase(buyerVerifyPaymentAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) state.message = payload;
      })

      .addCase(buyerCheckPaymentStatusAction.pending, (state) => {
        state.apiName = 'buyerPayment/checkStatus';
        state.loading = 'buyerPayment/checkStatus';
      })
      .addCase(buyerCheckPaymentStatusAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.buyerPayment = payload;
        state.alertType = 'success';
        state.message = 'Payment status fetched';
      })
      .addCase(buyerCheckPaymentStatusAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) state.message = payload;
      })

      .addCase(fetchSellerPaymentsAction.pending, (state) => {
        state.apiName = 'seller/fetchPayments';
        state.loading = 'seller/fetchPayments';
      })
      .addCase(fetchSellerPaymentsAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.sellerPayments = payload;
        state.alertType = 'success';
        state.message = 'Seller payments fetched';
      })
      .addCase(fetchSellerPaymentsAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) state.message = payload;
      })

      .addCase(fetchSellerEarningsAction.pending, (state) => {
        state.apiName = 'seller/fetchEarnings';
        state.loading = 'seller/fetchEarnings';
      })
      .addCase(fetchSellerEarningsAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.sellerEarnings = payload;
        state.alertType = 'success';
        state.message = 'Earnings fetched';
      })
      .addCase(fetchSellerEarningsAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) state.message = payload;
      });
  },
});

export const { clearPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
