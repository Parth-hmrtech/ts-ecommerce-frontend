import { createSlice } from '@reduxjs/toolkit';
import {
  fetchBuyerCartAction,
  addToBuyerCartAction,
  updateBuyerCartAction,
  deleteBuyerCartAction,
  deleteBuyerIdCartAction,
} from '@/store/actions/cart.action';

const initialState = {
  cart: [],
  loading: '',
  apiName: '',
  alertType: '',
  message: '',
  error: false,
};

const buyerCartSlice = createSlice({
  name: 'buyerCart',
  initialState,
  reducers: {
    clearBuyerCart: (state) => {
      state.cart = [];
      state.loading = '';
      state.apiName = '';
      state.alertType = '';
      state.message = '';
      state.error = false;
    },
  },
  extraReducers: (builder) => {

    builder.addCase(fetchBuyerCartAction.pending, (state) => {
      state.apiName = 'buyerCart/fetch';
      state.loading = 'buyerCart/fetch';
    });
    builder.addCase(fetchBuyerCartAction.fulfilled, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'success';
      state.message = 'Cart fetched successfully';
      state.cart = payload;
    });
    builder.addCase(fetchBuyerCartAction.rejected, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'error';
      if (payload) state.message = payload.message;
    });

    builder.addCase(addToBuyerCartAction.pending, (state) => {
      state.apiName = 'buyerCart/add';
      state.loading = 'buyerCart/add';
    });
    builder.addCase(addToBuyerCartAction.fulfilled, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'success';
      state.message = 'Item added to cart';
      state.cart.push(payload);
    });
    builder.addCase(addToBuyerCartAction.rejected, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'error';
      if (payload) state.message = payload.message;
    });

    builder.addCase(updateBuyerCartAction.pending, (state) => {
      state.apiName = 'buyerCart/update';
      state.loading = 'buyerCart/update';
    });
    builder.addCase(updateBuyerCartAction.fulfilled, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'success';
      state.message = 'Cart item updated';
      const index = state.cart.findIndex((item) => item.id === payload.id);
      if (index !== -1) {
        state.cart[index] = payload;
      }
    });
    builder.addCase(updateBuyerCartAction.rejected, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'error';
      if (payload) state.message = payload.message;
    });

    builder.addCase(deleteBuyerCartAction.pending, (state) => {
      state.apiName = 'buyerCart/delete';
      state.loading = 'buyerCart/delete';
    });
    builder.addCase(deleteBuyerCartAction.fulfilled, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'success';
      state.message = 'Item removed from cart';
      state.cart = state.cart.filter((item) => item.id !== payload);
    });
    builder.addCase(deleteBuyerCartAction.rejected, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'error';
      if (payload) state.message = payload.message;
    });

    builder.addCase(deleteBuyerIdCartAction.pending, (state) => {
      state.apiName = 'buyerCart/deleteAll';
      state.loading = 'buyerCart/deleteAll';
    });
    builder.addCase(deleteBuyerIdCartAction.fulfilled, (state) => {
      state.loading = '';
      state.alertType = 'success';
      state.message = 'Cart cleared';
      state.cart = [];
    });
    builder.addCase(deleteBuyerIdCartAction.rejected, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'error';
      state.message = payload?.message;
    });
  },
  
});

export const { clearBuyerCart } = buyerCartSlice.actions;
export default buyerCartSlice.reducer;
