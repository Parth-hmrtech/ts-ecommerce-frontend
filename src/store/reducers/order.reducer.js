import { createSlice } from '@reduxjs/toolkit';
import {
  placeBuyerOrderAction,
  fetchBuyerOrdersAction,
  fetchBuyerOrderByIdAction,
  updateBuyerOrderAddressAction,
  deleteBuyerOrderAction,
  fetchSellerOrdersAction,
  updateOrderStatusAction,
} from '@/store/actions/order.action';

const initialState = {
  buyerOrders: [],
  buyerOrderDetail: null,
  sellerOrders: [],
  loading: '',
  apiName: '',
  alertType: '',
  message: '',
  error: false,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderState: (state) => {
      state.loading = '';
      state.apiName = '';
      state.alertType = '';
      state.message = '';
      state.error = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(placeBuyerOrderAction.pending, (state) => {
      state.apiName = 'buyer/placeOrder';
      state.loading = 'buyer/placeOrder';
    });
    builder.addCase(placeBuyerOrderAction.fulfilled, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'success';
      state.message = 'Order placed successfully';
      state.buyerOrders.push(payload);
    });
    builder.addCase(placeBuyerOrderAction.rejected, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'error';
      if (payload) state.message = payload;
    });

    builder.addCase(fetchBuyerOrdersAction.pending, (state) => {
      state.apiName = 'buyer/fetchOrders';
      state.loading = 'buyer/fetchOrders';
    });
    builder.addCase(fetchBuyerOrdersAction.fulfilled, (state, { payload }) => {
      state.loading = '';
      state.buyerOrders = payload;
      state.alertType = 'success';
      state.message = 'Orders fetched successfully';
    });
    builder.addCase(fetchBuyerOrdersAction.rejected, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'error';
      if (payload) state.message = payload;
    });

    builder.addCase(fetchBuyerOrderByIdAction.pending, (state) => {
      state.apiName = 'buyer/fetchOrderById';
      state.loading = 'buyer/fetchOrderById';
    });
    builder.addCase(fetchBuyerOrderByIdAction.fulfilled, (state, { payload }) => {
      state.loading = '';
      state.buyerOrderDetail = payload;
      state.alertType = 'success';
      state.message = 'Order details fetched';
    });
    builder.addCase(fetchBuyerOrderByIdAction.rejected, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'error';
      if (payload) state.message = payload;
    });

    builder.addCase(updateBuyerOrderAddressAction.pending, (state) => {
      state.apiName = 'buyer/updateAddress';
      state.loading = 'buyer/updateAddress';
    });
    builder.addCase(updateBuyerOrderAddressAction.fulfilled, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'success';
      state.message = 'Address updated';
      state.buyerOrders = state.buyerOrders.map((order) =>
        order._id === payload._id ? payload : order
      );
    });
    builder.addCase(updateBuyerOrderAddressAction.rejected, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'error';
      if (payload) state.message = payload;
    });

    builder.addCase(deleteBuyerOrderAction.pending, (state) => {
      state.apiName = 'buyer/deleteOrder';
      state.loading = 'buyer/deleteOrder';
    });
    builder.addCase(deleteBuyerOrderAction.fulfilled, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'success';
      state.message = 'Order deleted';
      state.buyerOrders = state.buyerOrders.filter((o) => o._id !== payload._id);
    });
    builder.addCase(deleteBuyerOrderAction.rejected, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'error';
      if (payload) state.message = payload;
    });

    builder.addCase(fetchSellerOrdersAction.pending, (state) => {
      state.apiName = 'seller/fetchOrders';
      state.loading = 'seller/fetchOrders';
    });
    builder.addCase(fetchSellerOrdersAction.fulfilled, (state, { payload }) => {
      state.loading = '';
      state.sellerOrders = payload;
      state.alertType = 'success';
      state.message = 'Seller orders fetched';
    });
    builder.addCase(fetchSellerOrdersAction.rejected, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'error';
      if (payload) state.message = payload;
    });

    builder.addCase(updateOrderStatusAction.pending, (state) => {
      state.apiName = 'seller/updateOrderStatus';
      state.loading = 'seller/updateOrderStatus';
    });
    builder.addCase(updateOrderStatusAction.fulfilled, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'success';
      state.message = 'Order status updated';
      state.sellerOrders = state.sellerOrders.map((order) =>
        order._id === payload._id ? payload : order
      );
    });
    builder.addCase(updateOrderStatusAction.rejected, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'error';
      if (payload) state.message = payload;
    });
  },
});

export const { clearOrderState } = orderSlice.actions;
export default orderSlice.reducer;
