import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/libs/axios';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

 const fetchProductsAction = createAsyncThunk(
  'products/fetchProducts',
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {      
      const response = await apiRequest({
        method: 'GET',
        url: '/buyer/products',
      });      
      return fulfillWithValue(response?.data?.data || []);
    } catch (error) {
      return rejectWithValue('Something is wrong here');
    }
  }
);

 const fetchBuyerProductByIdAction = createAsyncThunk(
  'buyer/fetchBuyerProductById',
  async (productId, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: `/buyer/products/${productId}`,
      });
      return fulfillWithValue(response.data?.data || []);
    } catch (error) {
      return rejectWithValue('Something is wrong here');
    }
  }
);

 const fetchBuyerWishlistAction = createAsyncThunk(
  'buyerWishlist/fetchBuyerWishlist',
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: '/buyer/wishlist',
        headers: getAuthHeaders(),
      });
      return fulfillWithValue(response.data?.data || []);
    } catch (error) {
      return rejectWithValue('Something is wrong here');
    }
  }
);

 const addToBuyerWishlistAction = createAsyncThunk(
  'buyerWishlist/addToBuyerWishlist',
  async ({ buyer_id, product_id }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: '/buyer/wishlist',
        data: { buyer_id, product_id },
        headers: getAuthHeaders(),
      });
      return fulfillWithValue(response.data?.data || []);
    } catch (error) {
      return rejectWithValue('Something is wrong here');
    }
  }
);

 const deleteFromBuyerWishlistAction = createAsyncThunk(
  'buyerWishlist/deleteFromBuyerWishlist',
  async (wishlistId, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await apiRequest({
        method: 'DELETE',
        url: `/buyer/wishlist/${wishlistId}`,
        headers: getAuthHeaders(),
      });
      return fulfillWithValue({
        wishlistId,
        message: response?.data?.message || 'Deleted from wishlist',
      });
    } catch (error) {
      return rejectWithValue('Something is wrong here');
    }
  }
);

 const fetchAllProductsAction = createAsyncThunk(
  'products/fetchAll',
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: '/seller/products',
        headers: getAuthHeaders(),
      });
      return fulfillWithValue(response.data?.data || []);
    } catch (error) {
      return rejectWithValue('Something is wrong here');
    }
  }
);

 const addProductAction = createAsyncThunk(
  'products/add',
  async (data, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: '/seller/products',
        data,
        headers: getAuthHeaders(),
      });
      return fulfillWithValue(response.data?.data || []);
    } catch (error) {
      return rejectWithValue('Something is wrong here');
    }
  }
);

 const updateProductAction = createAsyncThunk(
  'products/update',
  async ({ id, ...productData }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await apiRequest({
        method: 'PUT',
        url: `/seller/products/${id}`,
        data: productData,
        headers: getAuthHeaders(),
      });
      return fulfillWithValue(response.data?.data || []);
    } catch (error) {
      return rejectWithValue('Something is wrong here');
    }
  }
);

 const deleteProductAction = createAsyncThunk(
  'products/delete',
  async (id, { fulfillWithValue, rejectWithValue }) => {
    try {
      await apiRequest({
        method: 'DELETE',
        url: `/seller/products/${id}`,
        headers: getAuthHeaders(),
      });
      return fulfillWithValue(id);
    } catch (error) {
      return rejectWithValue('Something is wrong here');
    }
  }
);

 const uploadProductImageAction = createAsyncThunk(
  'productImages/upload',
  async (formData, { fulfillWithValue, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await apiRequest({
        method: 'POST',
        url: '/seller/products/image',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      return fulfillWithValue(response.data?.data || []);
    } catch (error) {
      return rejectWithValue('Something is wrong here');
    }
  }
);

export {
  fetchProductsAction,
  fetchBuyerProductByIdAction,
  fetchBuyerWishlistAction,
  addToBuyerWishlistAction,
  deleteFromBuyerWishlistAction,
  fetchAllProductsAction,
  addProductAction,
  updateProductAction,
  deleteProductAction,
  uploadProductImageAction,
};
