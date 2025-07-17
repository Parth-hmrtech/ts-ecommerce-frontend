import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/libs/axios';
import type { APISuccessResponse } from '@/libs/axios';
import type { ICategory, ISubCategory } from '@/types/category.types';

const getHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

const fetchBuyerCategoriesAction = createAsyncThunk<APISuccessResponse, void>(
  'buyer/fetchBuyerCategories',
  async (_, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: '/buyer/categories',
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(new Error(error?.response?.data?.message || 'Something is wrong here'));
    }
  }
);

const fetchAllCategoriesAction = createAsyncThunk<APISuccessResponse, void>(
  'categories/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: '/seller/categories',
        headers: getHeaders(),
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(new Error(error?.response?.data?.message || 'Something is wrong here'));
    }
  }
);

const addCategoryAction = createAsyncThunk<APISuccessResponse, ICategory>(
  'categories/add',
  async (data, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: '/seller/categories',
        data,
        headers: getHeaders(),
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(new Error(error?.response?.data?.message || 'Something is wrong here'));
    }
  }
);

const updateCategoryAction = createAsyncThunk<APISuccessResponse, ICategory>(
  'categories/update',
  async ({ id, category_name }, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: 'PUT',
        url: `/seller/categories/${id}`,
        data: { category_name },
        headers: getHeaders(),
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(new Error(error?.response?.data?.message || 'Something is wrong here'));
    }
  }
);

const deleteCategoryAction = createAsyncThunk<APISuccessResponse, string>(
  'categories/delete',
  async (id, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: 'DELETE',
        url: `/seller/categories/${id}`,
        headers: getHeaders(),
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(new Error(error?.response?.data?.message || 'Something is wrong here'));
    }
  }
);

const fetchAllSubCategoriesAction = createAsyncThunk<APISuccessResponse, void>(
  'subcategories/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: '/seller/subcategories',
        headers: getHeaders(),
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(new Error(error?.response?.data?.message || 'Something is wrong here'));
    }
  }
);

const fetchAllSubCategoriesByIdAction = createAsyncThunk<APISuccessResponse, string>(
  'subcategories/fetchByCategoryId',
  async (categoryId, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: `/seller/subcategories/${categoryId}`,
        headers: getHeaders(),
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(new Error(error?.response?.data?.message || 'Something is wrong here'));
    }
  }
);

const addSubCategoryAction = createAsyncThunk<APISuccessResponse, ISubCategory>(
  'subcategories/add',
  async (data, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: '/seller/subcategories',
        data,
        headers: getHeaders(),
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(new Error(error?.response?.data?.message || 'Something is wrong here'));
    }
  }
);

const updateSubCategoryAction = createAsyncThunk<APISuccessResponse, ISubCategory>(
  'subcategories/update',
  async ({ id, sub_category_name }, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: 'PUT',
        url: `/seller/subcategories/${id}`,
        data: { sub_category_name },
        headers: getHeaders(),
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(new Error(error?.response?.data?.message || 'Something is wrong here'));
    }
  }
);

const deleteSubCategoryAction = createAsyncThunk<APISuccessResponse, string>(
  'subcategories/delete',
  async (id, thunkAPI) => {
    try {
      const response = await apiRequest({
        method: 'DELETE',
        url: `/seller/subcategories/${id}`,
        headers: getHeaders(),
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(new Error(error?.response?.data?.message || 'Something is wrong here'));
    }
  }
);

export {
  fetchBuyerCategoriesAction,
  fetchAllCategoriesAction,
  addCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
  fetchAllSubCategoriesAction,
  fetchAllSubCategoriesByIdAction,
  addSubCategoryAction,
  updateSubCategoryAction,
  deleteSubCategoryAction,
};
