import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/libs/axios';

import type {
  IProduct,
  IWishlistItem,
  IAddToWishlistPayload,
  IUpdateProductPayload,
  IApiResponse,
} from '@/types/product.types';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const fetchProductsAction = createAsyncThunk<IProduct[], void>(
  'products/fetchProducts',
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await apiRequest<IApiResponse<IProduct[]>>({
        method: 'GET',
        url: '/buyer/products',
      });
      return fulfillWithValue(response.data?.data || []);
    } catch (error) {
      return rejectWithValue('Something is wrong here');
    }
  }
);

export const fetchBuyerProductByIdAction = createAsyncThunk<IProduct, string>(
  'buyer/fetchBuyerProductById',
  async (productId, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await apiRequest<IApiResponse<IProduct>>({
        method: 'GET',
        url: `/buyer/products/${productId}`,
      });
      return fulfillWithValue(response.data?.data);
    } catch (error) {
      return rejectWithValue('Something is wrong here');
    }
  }
);

export const fetchBuyerWishlistAction = createAsyncThunk<IWishlistItem[]>(
  'buyerWishlist/fetchBuyerWishlist',
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await apiRequest<IApiResponse<IWishlistItem[]>>({
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

export const addToBuyerWishlistAction = createAsyncThunk<
  IWishlistItem,
  IAddToWishlistPayload
>(
  'buyerWishlist/addToBuyerWishlist',
  async ({ buyer_id, product_id }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await apiRequest<IApiResponse<IWishlistItem>>({
        method: 'POST',
        url: '/buyer/wishlist',
        data: { buyer_id, product_id },
        headers: getAuthHeaders(),
      });
      return fulfillWithValue(response.data?.data);
    } catch (error) {
      return rejectWithValue('Something is wrong here');
    }
  }
);

export const deleteFromBuyerWishlistAction = createAsyncThunk<
  { wishlistId: string; message: string },
  string
>(
  'buyerWishlist/deleteFromBuyerWishlist',
  async (wishlistId, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await apiRequest<IApiResponse<null>>({
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

export const fetchAllProductsAction = createAsyncThunk<IProduct[]>(
  'products/fetchAll',
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await apiRequest<IApiResponse<IProduct[]>>({
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

export const addProductAction = createAsyncThunk<
  IProduct,
  FormData | Record<string, any>
>(
  'products/add',
  async (data, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await apiRequest<IApiResponse<IProduct>>({
        method: 'POST',
        url: '/seller/products',
        data,
        headers: getAuthHeaders(),
      });
      return fulfillWithValue(response.data?.data);
    } catch (error) {
      return rejectWithValue('Something is wrong here');
    }
  }
);

export const updateProductAction = createAsyncThunk<
  IProduct,
  IUpdateProductPayload
>(
  'products/update',
  async ({ id, ...productData }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await apiRequest<IApiResponse<IProduct>>({
        method: 'PUT',
        url: `/seller/products/${id}`,
        data: productData,
        headers: getAuthHeaders(),
      });
      return fulfillWithValue(response.data?.data);
    } catch (error) {
      return rejectWithValue('Something is wrong here');
    }
  }
);

export const deleteProductAction = createAsyncThunk<string, string>(
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

export const uploadProductImageAction = createAsyncThunk<
  IProduct,
  FormData
>(
  'productImages/upload',
  async (formData, { fulfillWithValue, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await apiRequest<IApiResponse<IProduct>>({
        method: 'POST',
        url: '/seller/products/image',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      return fulfillWithValue(response.data?.data);
    } catch (error) {
      return rejectWithValue('Something is wrong here');
    }
  }
);
