import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/libs/axios';

const getHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

const fetchBuyerCategoriesAction = createAsyncThunk(
  'buyer/fetchBuyerCategories',
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: '/buyer/categories',
      });
      return fulfillWithValue(response.data?.data || []);
    } catch (error) {
      return rejectWithValue('Something is wrong here');
    }
  }
);

const fetchAllCategoriesAction = createAsyncThunk(
  'categories/fetchAll',
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: '/seller/categories',
        headers: getHeaders(),
      });
      return fulfillWithValue(response.data?.data || []);
    } catch (error) {
      return rejectWithValue('Something is wrong here');
    }
  }
);

const addCategoryAction = createAsyncThunk(
  'categories/add',
  async (data, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: '/seller/categories',
        data,
        headers: getHeaders(),
      });
      return fulfillWithValue(response.data?.data || []);
    } catch (error) {
      return rejectWithValue('Something is wrong here');
    }
  }
);

const updateCategoryAction = createAsyncThunk(
  'categories/update',
  async ({ id, category_name }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await apiRequest({
        method: 'PUT',
        url: `/seller/categories/${id}`,
        data: { category_name },
        headers: getHeaders(),
      });
      return fulfillWithValue(response.data?.data || []);
    } catch (error) {
      return rejectWithValue('Something is wrong here');
    }
  }
);

const deleteCategoryAction = createAsyncThunk(
  'categories/delete',
  async (id, { fulfillWithValue, rejectWithValue }) => {
    try {
      await apiRequest({
        method: 'DELETE',
        url: `/seller/categories/${id}`,
        headers: getHeaders(),
      });
      return fulfillWithValue(id);
    } catch (error) {
      return rejectWithValue('Something is wrong here');
    }
  }
);

const fetchAllSubCategoriesAction = createAsyncThunk(
  'subcategories/fetchAll',
  async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: '/seller/subcategories',
        headers: getHeaders(),
      });
      return fulfillWithValue(response.data?.data || []);
    } catch (error) {
      return rejectWithValue('Something is wrong here');
    }
  }
);

const fetchAllSubCategoriesByIdAction = createAsyncThunk(
  'subcategories/fetchByCategoryId',
  async (categoryId, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await apiRequest({
        method: 'GET',
        url: `/seller/subcategories/${categoryId}`,
        headers: getHeaders(),
      });
      return fulfillWithValue(response.data?.data || []);
    } catch (error) {
      return rejectWithValue('Something is wrong here');
    }
  }
);

const addSubCategoryAction = createAsyncThunk(
  'subcategories/add',
  async (data, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await apiRequest({
        method: 'POST',
        url: '/seller/subcategories',
        data,
        headers: getHeaders(),
      });
      return fulfillWithValue(response.data?.data || []);
    } catch (error) {
      return rejectWithValue('Something is wrong here');
    }
  }
);

const updateSubCategoryAction = createAsyncThunk(
  'subcategories/update',
  async ({ id, sub_category_name }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await apiRequest({
        method: 'PUT',
        url: `/seller/subcategories/${id}`,
        data: { sub_category_name },
        headers: getHeaders(),
      });
      return fulfillWithValue(response.data?.data || []);
    } catch (error) {
      return rejectWithValue('Something is wrong here');
    }
  }
);

const deleteSubCategoryAction = createAsyncThunk(
  'subcategories/delete',
  async (id, { fulfillWithValue, rejectWithValue }) => {
    try {
      await apiRequest({
        method: 'DELETE',
        url: `/seller/subcategories/${id}`,
        headers: getHeaders(),
      });
      return fulfillWithValue(id);
    } catch (error) {
      return rejectWithValue('Something is wrong here');
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
