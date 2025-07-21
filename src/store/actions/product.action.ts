import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/libs/axios';
import type { APISuccessResponse } from '@/libs/axios';
import type { IAddProduct, IProduct, IWishlistAdd } from '@/types/product.types';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

const fetchProductsAction = createAsyncThunk<APISuccessResponse, void>(
  'products/fetchProducts',

  async (_, thunkAPI) => {
    try {

      const response = await apiRequest({
        method: 'GET',
        url: '/buyer/products',
      });
      
      return thunkAPI.fulfillWithValue(response?.data?.data || []);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        new Error(error?.response?.data?.message || 'Something is wrong here')
      );
    }
  }
);

const fetchBuyerProductByIdAction = createAsyncThunk<APISuccessResponse, string>(
  'buyer/fetchBuyerProductById',
  async (productId, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: `/buyer/products/${productId}`,
      });

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        new Error(error?.response?.data?.message || 'Something is wrong here')
      );
    }
  });

const fetchBuyerWishlistAction = createAsyncThunk<APISuccessResponse>(
  'buyerWishlist/fetchBuyerWishlist',
  async (_, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: '/buyer/wishlist',
        headers: getAuthHeaders(),
      });
      return thunkAPI.fulfillWithValue(response.data?.data || []);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        new Error(error?.response?.data?.message || 'Something is wrong here')
      );
    }
  }
);

const addToBuyerWishlistAction = createAsyncThunk<APISuccessResponse, IWishlistAdd>(
  'buyerWishlist/addToBuyerWishlist',
  async ({ buyer_id, product_id }, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: '/buyer/wishlist',
        data: { buyer_id, product_id },
        headers: getAuthHeaders(),
      });
      return thunkAPI.fulfillWithValue(response.data?.data || []);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        new Error(error?.response?.data?.message || 'Something is wrong here')
      );
    }
  }
);

const deleteFromBuyerWishlistAction = createAsyncThunk<APISuccessResponse, string>(
  'buyerWishlist/deleteFromBuyerWishlist',
  async (wishlistId, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: 'DELETE',
        url: `/buyer/wishlist/${wishlistId}`,
        headers: getAuthHeaders(),
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        new Error(error?.response?.data?.message || 'Something is wrong here')
      );
    }
  }
);

const fetchAllProductsAction = createAsyncThunk<APISuccessResponse, void>(
  'products/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: '/seller/products',
        headers: getAuthHeaders(),
      });
      
      return thunkAPI.fulfillWithValue(response.data?.data || []);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        new Error(error?.response?.data?.message || 'Something is wrong here')
      );
    }
  }
);

const addProductAction = createAsyncThunk<APISuccessResponse, IAddProduct>(
  'products/add',
  async (data, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: '/seller/products',
        data,
        headers: getAuthHeaders(),
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        new Error(error?.response?.data?.message || 'Something is wrong here')
      );
    }
  }
);

const updateProductAction = createAsyncThunk<APISuccessResponse, IProduct>(
  'products/update',
  async ({ id, ...productData }, thunkAPI) => {
    try {
      console.log(id);
      console.log(productData);
      
      const response = await apiRequest({
        method: 'PUT',
        url: `/seller/products/${id}`,
        data: productData,
        headers: getAuthHeaders(),
      });
      return thunkAPI.fulfillWithValue(response.data?.data || []);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        new Error(error?.response?.data?.message || 'Something is wrong here')
      );
    }
  }
);

const deleteProductAction = createAsyncThunk(
  'products/delete',
  async (id: string, thunkAPI) => {
    try {
      await apiRequest({
        method: 'DELETE',
        url: `/seller/products/${id}`,
        headers: getAuthHeaders(),
      });
      return thunkAPI.fulfillWithValue(id);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        new Error(error?.response?.data?.message || 'Something is wrong here')
      );
    }
  }
);

const uploadProductImageAction = createAsyncThunk(
  'productImages/upload',
  async (formData: FormData, thunkAPI) => {
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
      return thunkAPI.fulfillWithValue(response.data?.data || []);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        new Error(error?.response?.data?.message || 'Something is wrong here')
      );
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
