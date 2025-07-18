import { createSlice } from '@reduxjs/toolkit';
import {
  fetchProductsAction,
  fetchBuyerProductByIdAction,
  fetchAllProductsAction,
  addProductAction,
  updateProductAction,
  deleteProductAction,
  uploadProductImageAction,
  fetchBuyerWishlistAction,
  addToBuyerWishlistAction,
  deleteFromBuyerWishlistAction,
} from '@/store/actions/product.action';
import type { IProduct } from '@/types/product.types';

interface IProductState {
  products: IProduct[];
  productDetail: IProduct | null;
  buyerWishlist: IProduct[];
  uploadedImage: any;
  loading: string;
  apiName: string;
  alertType: '' | 'success' | 'error';
  message: string;
  error: boolean;
}

const initialState: IProductState = {
  products: [],
  productDetail: null,
  buyerWishlist: [],
  uploadedImage: null,
  loading: '',
  apiName: '',
  alertType: '',
  message: '',
  error: false,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearProductState(state) {
      state.loading = '';
      state.apiName = '';
      state.alertType = '';
      state.message = '';
      state.error = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsAction.pending, (state) => {
        state.apiName = 'buyer/fetchProducts';
        state.loading = 'buyer/fetchProducts';
      })
      .addCase(fetchProductsAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.products = payload;
        state.alertType = 'success';
        state.message = payload.message;
      })
      .addCase(fetchProductsAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) {
          state.message = payload.message;
        }
      })

      .addCase(fetchBuyerProductByIdAction.pending, (state) => {
        state.apiName = 'buyer/fetchProductById';
        state.loading = 'buyer/fetchProductById';
      })
      .addCase(fetchBuyerProductByIdAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.productDetail = payload.data;
        state.alertType = 'success';
        state.message = payload.message;
      })
      .addCase(fetchBuyerProductByIdAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) {
          state.message = payload.message;
        }
      })

      .addCase(fetchAllProductsAction.pending, (state) => {
        state.apiName = 'seller/fetchProducts';
        state.loading = 'seller/fetchProducts';
      })
      .addCase(fetchAllProductsAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.products = payload.data;
        state.alertType = 'success';
        state.message = payload.message;
      })
      .addCase(fetchAllProductsAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) {
          state.message = payload.message;
        }
      })

      .addCase(addProductAction.pending, (state) => {
        state.apiName = 'seller/addProduct';
        state.loading = 'seller/addProduct';
      })
      .addCase(addProductAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.products.push(payload.data);
        state.alertType = 'success';
        state.message = payload.message;
      })
      .addCase(addProductAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) {
          state.message = payload.message;
        }
      })

      .addCase(updateProductAction.pending, (state) => {
        state.apiName = 'seller/updateProduct';
        state.loading = 'seller/updateProduct';
      })
      .addCase(updateProductAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.products = state.products.map((p) =>
          p._id === payload.data._id ? payload.data : p
        );
        state.alertType = 'success';
        state.message = payload.message;
      })
      .addCase(updateProductAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) {
          state.message = payload.message;
        }
      })

      .addCase(deleteProductAction.pending, (state) => {
        state.apiName = 'seller/deleteProduct';
        state.loading = 'seller/deleteProduct';
      })
      .addCase(deleteProductAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.products = state.products.filter((p) => p._id !== payload.data);
        state.alertType = 'success';
        state.message = payload.message;
      })
      .addCase(deleteProductAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) {
          state.message = payload.message;
        }
      })

      .addCase(uploadProductImageAction.pending, (state) => {
        state.apiName = 'seller/uploadProductImage';
        state.loading = 'seller/uploadProductImage';
      })
      .addCase(uploadProductImageAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.uploadedImage = payload.data;
        state.alertType = 'success';
        state.message = payload.message;
      })
      .addCase(uploadProductImageAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) {
          state.message = payload.message;
        }
      })

      .addCase(fetchBuyerWishlistAction.pending, (state) => {
        state.apiName = 'buyer/fetchWishlist';
        state.loading = 'buyer/fetchWishlist';
      })
      .addCase(fetchBuyerWishlistAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.buyerWishlist = payload || [];
        state.alertType = 'success';
        state.message = payload.message;
      })
      .addCase(fetchBuyerWishlistAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) {
          state.message = payload.message;
        }
      })


      .addCase(addToBuyerWishlistAction.pending, (state) => {
        state.apiName = 'buyer/addToWishlist';
        state.loading = 'buyer/addToWishlist';
      })
      .addCase(addToBuyerWishlistAction.fulfilled, (state, { payload = {} }) => {
        state.loading = '';
        state.buyerWishlist = Array.isArray(state.buyerWishlist) ? state.buyerWishlist : [];
        const newItem = payload.data;
        if (newItem && !state.buyerWishlist.some(item => item._id === newItem._id)) {
          state.buyerWishlist.push(newItem);
        }
        state.alertType = 'success';
        state.message = payload.message || '';
      })

      .addCase(addToBuyerWishlistAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) {
          state.message = payload.message;
        }
      })

      .addCase(deleteFromBuyerWishlistAction.pending, (state) => {
        state.apiName = 'buyer/deleteFromWishlist';
        state.loading = 'buyer/deleteFromWishlist';
      })
      .addCase(deleteFromBuyerWishlistAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.buyerWishlist = state.buyerWishlist.filter(
          (item) => item.id !== payload.data
        );
        state.alertType = 'success';
        state.message = payload.message;
      })
      .addCase(deleteFromBuyerWishlistAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) {
          state.message = payload.message;
        }
      });
  },
});

export const { clearProductState } = productSlice.actions;
export default productSlice.reducer;
