import { createSlice,  } from '@reduxjs/toolkit';
import {
  placeBuyerOrderAction,
  fetchBuyerOrdersAction,
  fetchBuyerOrderByIdAction,
  updateBuyerOrderAddressAction,
  deleteBuyerOrderAction,
  fetchSellerOrdersAction,
  updateOrderStatusAction,
} from '@/store/actions/order.action';

interface OrderState {
  buyerOrders: any[];
  buyerOrderDetail: any | null;
  sellerOrders: any[];
  loading: string;
  apiName: string;
  alertType: string;
  message: string;
  error: boolean;
}

const initialState: OrderState = {
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
    builder
      .addCase(placeBuyerOrderAction.pending, (state) => {
        state.apiName = 'buyer/placeOrder';
        state.loading = 'buyer/placeOrder';
      })
      .addCase(placeBuyerOrderAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'success';
        state.message = 'Order placed successfully';
        state.buyerOrders.push(payload);
      })
      .addCase(placeBuyerOrderAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) state.message = payload.message;
      })

      .addCase(fetchBuyerOrdersAction.pending, (state) => {
        state.apiName = 'buyer/fetchOrders';
        state.loading = 'buyer/fetchOrders';
      })
      .addCase(fetchBuyerOrdersAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.buyerOrders = payload.data;        
        state.alertType = 'success';
        state.message = 'Orders fetched successfully';
      })
      .addCase(fetchBuyerOrdersAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) state.message = payload.message;
      })

      .addCase(fetchBuyerOrderByIdAction.pending, (state) => {
        state.apiName = 'buyer/fetchOrderById';
        state.loading = 'buyer/fetchOrderById';
      })
      .addCase(fetchBuyerOrderByIdAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.buyerOrderDetail = payload;
        state.alertType = 'success';
        state.message = 'Order details fetched';
      })
      .addCase(fetchBuyerOrderByIdAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) state.message = payload.message;
      })

      .addCase(updateBuyerOrderAddressAction.pending, (state) => {
        state.apiName = 'buyer/updateAddress';
        state.loading = 'buyer/updateAddress';
      })
      .addCase(updateBuyerOrderAddressAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'success';
        state.message = 'Address updated';
        state.buyerOrders = state.buyerOrders.map((order) =>
          order._id === payload._id ? payload : order
        );
      })
      .addCase(updateBuyerOrderAddressAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) state.message = payload.message;
      })

      .addCase(deleteBuyerOrderAction.pending, (state) => {
        state.apiName = 'buyer/deleteOrder';
        state.loading = 'buyer/deleteOrder';
      })
      .addCase(deleteBuyerOrderAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'success';
        state.message = 'Order deleted';
        state.buyerOrders = state.buyerOrders.filter((o) => o._id !== payload._id);
      })
      .addCase(deleteBuyerOrderAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) state.message = payload.message;
      })

      .addCase(fetchSellerOrdersAction.pending, (state) => {
        state.apiName = 'seller/fetchOrders';
        state.loading = 'seller/fetchOrders';
      })
      .addCase(fetchSellerOrdersAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.sellerOrders = payload;
        state.alertType = 'success';
        state.message = 'Seller orders fetched';
      })
      .addCase(fetchSellerOrdersAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) state.message = payload.message;
      })

      .addCase(updateOrderStatusAction.pending, (state) => {
        state.apiName = 'seller/updateOrderStatus';
        state.loading = 'seller/updateOrderStatus';
      })
      .addCase(updateOrderStatusAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'success';
        state.message = 'Order status updated';
        state.sellerOrders = state.sellerOrders.map((order) =>
          order._id === payload._id ? payload : order
        );
      })
      .addCase(updateOrderStatusAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) state.message = payload.message;
      });
  },
});

export const { clearOrderState } = orderSlice.actions;
export default orderSlice.reducer;
