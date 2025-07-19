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
        state.message = payload?.message || 'Error fetching buyer products';
      })

      // FETCH PRODUCT BY ID
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
        state.message = payload?.message || 'Error fetching product detail';
      })

      // FETCH ALL seller PRODUCTS
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
        state.message = payload?.message || 'Error fetching all products';
      })

      // ADD PRODUCT
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
        state.message = payload?.message || 'Error adding product';
      })

      // UPDATE PRODUCT
      .addCase(updateProductAction.pending, (state) => {
        state.apiName = 'seller/updateProduct';
        state.loading = 'seller/updateProduct';
      })
      .addCase(updateProductAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        const updatedProduct = payload.data;
        if (updatedProduct?.id) {
          state.products = state.products.map((p) =>
            p.id === updatedProduct.id ? updatedProduct : p
          );
          state.alertType = 'success';
          state.message = payload.message || 'Product updated';
        } else {
          state.alertType = 'error';
          state.message = 'Invalid update payload';
        }
      })
      .addCase(updateProductAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        state.message = payload?.message || 'Error updating product';
      })

      // DELETE PRODUCT
      .addCase(deleteProductAction.pending, (state) => {
        state.apiName = 'seller/deleteProduct';
        state.loading = 'seller/deleteProduct';
      })
      .addCase(deleteProductAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.products = state.products.filter((p) => p.id !== payload.data);
        state.alertType = 'success';
        state.message = payload.message;
      })
      .addCase(deleteProductAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        state.message = payload?.message || 'Error deleting product';
      })

      // UPLOAD PRODUCT IMAGE
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
        state.message = payload?.message || 'Error uploading image';
      })

      // FETCH BUYER WISHLIST
      .addCase(fetchBuyerWishlistAction.pending, (state) => {
        state.apiName = 'buyer/fetchWishlist';
        state.loading = 'buyer/fetchWishlist';
      })
      .addCase(fetchBuyerWishlistAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.buyerWishlist = Array.isArray(payload.data) ? payload.data : [];
        state.alertType = 'success';
        state.message = payload.message;
      })
      .addCase(fetchBuyerWishlistAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        state.message = payload?.message || 'Error fetching wishlist';
      })

      // ADD TO BUYER WISHLIST
      .addCase(addToBuyerWishlistAction.pending, (state) => {
        state.apiName = 'buyer/addToWishlist';
        state.loading = 'buyer/addToWishlist';
      })
      .addCase(addToBuyerWishlistAction.fulfilled, (state, { payload = {} }) => {
        state.loading = '';
        const newItem = payload.data;
        if (newItem && !state.buyerWishlist.some(item => item.id === newItem.id)) {
          state.buyerWishlist.push(newItem);
        }
        state.alertType = 'success';
        state.message = payload.message || '';
      })
      .addCase(addToBuyerWishlistAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        state.message = payload?.message || 'Error adding to wishlist';
      })

      // DELETE FROM BUYER WISHLIST
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
        state.message = payload?.message || 'Error deleting from wishlist';
      });
  },
});

export const { clearProductState } = productSlice.actions;
export default productSlice.reducer;
