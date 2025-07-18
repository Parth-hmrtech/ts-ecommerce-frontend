import { createSlice } from '@reduxjs/toolkit';
import {
  fetchBuyerCartAction,
  addToBuyerCartAction,
  updateBuyerCartAction,
  deleteBuyerCartAction,
  deleteBuyerIdCartAction,
} from '@/store/actions/cart.action';
import type { ICartItem } from '@/types/cart.types';

interface BuyerCartState {
  cart: ICartItem[];
  updatedCart: ICartItem | null;
  loading: string;
  apiName: string;
  alertType: string;
  message: string;
  error: boolean;
}

const initialState: BuyerCartState = {
  cart: [],
updatedCart: null,
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
    builder
      .addCase(fetchBuyerCartAction.pending, (state) => {
        state.apiName = 'buyerCart/fetch';
        state.loading = 'buyerCart/fetch';
      })
      .addCase(fetchBuyerCartAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'success';
        state.message = payload.message;
        state.cart = payload.data;
        state.error = false;
      })
      .addCase(fetchBuyerCartAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) state.message = payload.message;
      })

      .addCase(addToBuyerCartAction.pending, (state) => {
        state.apiName = 'buyerCart/add';
        state.loading = 'buyerCart/add';
      })
      .addCase(addToBuyerCartAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'success';
        state.message = payload.message;
        state.cart.push(payload.data);
        state.error = false;
      })
      .addCase(addToBuyerCartAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) state.message = payload.message;
      })

      .addCase(updateBuyerCartAction.pending, (state) => {
        state.apiName = 'buyerCart/update';
        state.loading = 'buyerCart/update';
      })
      .addCase(updateBuyerCartAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'success';
        state.message = payload.message;
        state.error = false;

        const updatedCartItem: ICartItem | undefined = payload?.data?.updatedCart;

        if (updatedCartItem && updatedCartItem.id) {
          state.cart = state.cart.map((item) =>
            item.id === updatedCartItem.id ? updatedCartItem : item
          );
          state.updatedCart = updatedCartItem; 
        }
      })

      .addCase(updateBuyerCartAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) state.message = payload.message;
      })

      .addCase(deleteBuyerCartAction.pending, (state) => {
        state.apiName = 'buyerCart/delete';
        state.loading = 'buyerCart/delete';
      })
      .addCase(deleteBuyerCartAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'success';
        state.message = payload.message;
        state.cart = state.cart.filter((item) => item.id !== payload.data);
        state.error = false;
      })
      .addCase(deleteBuyerCartAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) state.message = payload.message;
      })

      .addCase(deleteBuyerIdCartAction.pending, (state) => {
        state.apiName = 'buyerCart/deleteAll';
        state.loading = 'buyerCart/deleteAll';
      })
      .addCase(deleteBuyerIdCartAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'success';
        state.message = payload.message;
        state.cart = [];
        state.error = false;
      })
      .addCase(deleteBuyerIdCartAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) state.message = payload.message;
      });
  },
});

export const { clearBuyerCart } = buyerCartSlice.actions;
export default buyerCartSlice.reducer;
