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

const initialState = {
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
    clearProductState: (state) => {
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
        state.alertType = null;
        state.message = '';
      })
      .addCase(fetchProductsAction.fulfilled, (state, { payload }) => {
        state.loading = '';
        state.products = payload || [];
        state.alertType = 'success';
        state.message = 'Buyer products fetched successfully';
      })
      .addCase(fetchProductsAction.rejected, (state, { payload }) => {
        state.loading = '';
        state.products = []; 
        state.alertType = 'error';
        state.message = payload?.message || 'Failed to fetch buyer products';
      })

      .addCase(fetchBuyerProductByIdAction.pending, (state) => {
        state.apiName = 'buyer/fetchProductById';
        state.loading = 'buyer/fetchProductById';
      })
      .addCase(fetchBuyerProductByIdAction.fulfilled, (state, { payload }) => {
        state.loading = '';
        state.productDetail = payload;
        state.alertType = 'success';
        state.message = 'Product detail loaded';
      })
      .addCase(fetchBuyerProductByIdAction.rejected, (state, { payload }) => {
        state.loading = '';
        state.alertType = 'error';
        state.message = payload || 'Failed to fetch product detail';
      })

      .addCase(fetchAllProductsAction.pending, (state) => {
        state.apiName = 'seller/fetchProducts';
        state.loading = 'seller/fetchProducts';
      })
      .addCase(fetchAllProductsAction.fulfilled, (state, { payload }) => {
        state.loading = '';
        state.products = payload;        
        state.alertType = 'success';
        state.message = 'Seller products fetched';
      })
      .addCase(fetchAllProductsAction.rejected, (state, { payload }) => {
        state.loading = '';
        state.alertType = 'error';
        state.message = payload || 'Failed to fetch seller products';
      })

      .addCase(addProductAction.pending, (state) => {
        state.apiName = 'seller/addProduct';
        state.loading = 'seller/addProduct';
      })
      .addCase(addProductAction.fulfilled, (state, { payload }) => {
        state.loading = '';
        state.products.push(payload);
        console.log(payload);
        
        state.alertType = 'success';
        state.message = 'Product added successfully';
      })
      .addCase(addProductAction.rejected, (state, { payload }) => {
        state.loading = '';
        state.alertType = 'error';
        state.message = payload || 'Failed to add product';
      })

      .addCase(updateProductAction.pending, (state) => {
        state.apiName = 'seller/updateProduct';
        state.loading = 'seller/updateProduct';
      })
      .addCase(updateProductAction.fulfilled, (state, { payload }) => {
        state.loading = '';
        state.products = state.products.map((p) =>
          p._id === payload._id ? payload : p
        );
        state.alertType = 'success';
        state.message = 'Product updated successfully';
      })
      .addCase(updateProductAction.rejected, (state, { payload }) => {
        state.loading = '';
        state.alertType = 'error';
        state.message = payload || 'Failed to update product';
      })

      .addCase(deleteProductAction.pending, (state) => {
        state.apiName = 'seller/deleteProduct';
        state.loading = 'seller/deleteProduct';
      })
      .addCase(deleteProductAction.fulfilled, (state, { payload }) => {
        state.loading = '';
        state.products = state.products.filter((p) => p._id !== payload);
        state.alertType = 'success';
        state.message = 'Product deleted successfully';
      })
      .addCase(deleteProductAction.rejected, (state, { payload }) => {
        state.loading = '';
        state.alertType = 'error';
        state.message = payload || 'Failed to delete product';
      })

      .addCase(uploadProductImageAction.pending, (state) => {
        state.apiName = 'seller/uploadProductImage';
        state.loading = 'seller/uploadProductImage';
      })
      .addCase(uploadProductImageAction.fulfilled, (state, { payload }) => {
        state.loading = '';
        state.uploadedImage = payload;
        state.alertType = 'success';
        state.message = 'Image uploaded';
      })
      .addCase(uploadProductImageAction.rejected, (state, { payload }) => {
        state.loading = '';
        state.alertType = 'error';
        state.message = payload || 'Image upload failed';
      })

      .addCase(fetchBuyerWishlistAction.pending, (state) => {
        state.apiName = 'buyer/fetchWishlist';
        state.loading = 'buyer/fetchWishlist';
      })
      .addCase(fetchBuyerWishlistAction.fulfilled, (state, { payload }) => {
        state.loading = '';
        state.buyerWishlist = payload || [];
        state.alertType = 'success';
        state.message = 'Wishlist fetched';
      })
      .addCase(fetchBuyerWishlistAction.rejected, (state, { payload }) => {
        state.loading = '';
        state.alertType = 'error';
        state.message = payload || 'Failed to fetch wishlist';
      })

      .addCase(addToBuyerWishlistAction.pending, (state) => {
        state.apiName = 'buyer/addToWishlist';
        state.loading = 'buyer/addToWishlist';
      })
      .addCase(addToBuyerWishlistAction.fulfilled, (state, { payload }) => {
        state.loading = '';
        const exists = state.buyerWishlist.some((item) => item._id === payload._id);
        if (!exists) {
          state.buyerWishlist.push(payload);
        }
        state.alertType = 'success';
        state.message = 'Added to wishlist';
      })
      .addCase(addToBuyerWishlistAction.rejected, (state, { payload }) => {
        state.loading = '';
        state.alertType = 'error';
        state.message = payload || 'Failed to add to wishlist';
      })

      .addCase(deleteFromBuyerWishlistAction.pending, (state) => {
        state.apiName = 'buyer/deleteFromWishlist';
        state.loading = 'buyer/deleteFromWishlist';
      })
      .addCase(deleteFromBuyerWishlistAction.fulfilled, (state, { payload }) => {
        state.loading = '';
        state.buyerWishlist = state.buyerWishlist.filter((item) => item._id !== payload);
        state.alertType = 'success';
        state.message = 'Removed from wishlist';
      })
      .addCase(deleteFromBuyerWishlistAction.rejected, (state, { payload }) => {
        state.loading = '';
        state.alertType = 'error';
        state.message = payload || 'Failed to remove from wishlist';
      });
  },
});

export const { clearProductState } = productSlice.actions;
export default productSlice.reducer;
