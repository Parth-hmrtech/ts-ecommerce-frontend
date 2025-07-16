import { createSlice } from '@reduxjs/toolkit';
import {
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
} from '@/store/actions/category.action';

const initialState = {
  list: [],
  subcategories: [],
  subcategoriesByCategory: [],
  loading: '',
  apiName: '',
  alertType: '',
  message: '',
  error: false,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    clearCategoryState: (state) => {
      state.loading = '';
      state.apiName = '';
      state.alertType = '';
      state.message = '';
      state.error = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllCategoriesAction.pending, (state) => {
      state.apiName = 'seller/fetchCategories';
      state.loading = 'seller/fetchCategories';
    });
    builder.addCase(fetchAllCategoriesAction.fulfilled, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'success';
      state.message = 'Categories fetched successfully';
      state.list = payload || [];
    });
    builder.addCase(fetchAllCategoriesAction.rejected, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'error';
      if (payload) state.message = payload;
    });

    builder.addCase(addCategoryAction.pending, (state) => {
      state.apiName = 'seller/addCategory';
      state.loading = 'seller/addCategory';
    });
    builder.addCase(addCategoryAction.fulfilled, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'success';
      state.message = 'Category added successfully';
      state.list.push(payload);
    });
    builder.addCase(addCategoryAction.rejected, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'error';
      if (payload) state.message = payload;
    });

    builder.addCase(updateCategoryAction.pending, (state) => {
      state.apiName = 'seller/updateCategory';
      state.loading = 'seller/updateCategory';
    });
    builder.addCase(updateCategoryAction.fulfilled, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'success';
      state.message = 'Category updated successfully';
      state.list = state.list.map((cat) => (cat._id === payload._id ? payload : cat));
    });
    builder.addCase(updateCategoryAction.rejected, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'error';
      if (payload) state.message = payload;
    });

    builder.addCase(deleteCategoryAction.pending, (state) => {
      state.apiName = 'seller/deleteCategory';
      state.loading = 'seller/deleteCategory';
    });
    builder.addCase(deleteCategoryAction.fulfilled, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'success';
      state.message = 'Category deleted successfully';
      state.list = state.list.filter((cat) => cat._id !== payload);
    });
    builder.addCase(deleteCategoryAction.rejected, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'error';
      if (payload) state.message = payload;
    });

    builder.addCase(fetchBuyerCategoriesAction.pending, (state) => {
      state.apiName = 'buyer/fetchCategories';
      state.loading = 'buyer/fetchCategories';
    });
    builder.addCase(fetchBuyerCategoriesAction.fulfilled, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'success';
      state.message = 'Buyer categories fetched';
      state.list = payload || [];
    });
    builder.addCase(fetchBuyerCategoriesAction.rejected, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'error';
      if (payload) state.message = payload;
    });

    builder.addCase(fetchAllSubCategoriesAction.pending, (state) => {
      state.apiName = 'seller/fetchSubcategories';
      state.loading = 'seller/fetchSubcategories';
    });
    builder.addCase(fetchAllSubCategoriesAction.fulfilled, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'success';
      state.message = 'Subcategories fetched';
      state.subcategories = payload || [];
    });
    builder.addCase(fetchAllSubCategoriesAction.rejected, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'error';
      if (payload) state.message = payload;
    });

    builder.addCase(fetchAllSubCategoriesByIdAction.pending, (state) => {
      state.apiName = 'seller/fetchSubcategoriesByCategory';
      state.loading = 'seller/fetchSubcategoriesByCategory';
    });
    builder.addCase(fetchAllSubCategoriesByIdAction.fulfilled, (state, { payload }) => {
      state.loading = '';
      state.subcategoriesByCategory = payload || [];
      state.alertType = 'success';
      state.message = 'Subcategories by category fetched';
    });
    builder.addCase(fetchAllSubCategoriesByIdAction.rejected, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'error';
      if (payload) state.message = payload;
    });

    builder.addCase(addSubCategoryAction.pending, (state) => {
      state.apiName = 'seller/addSubcategory';
      state.loading = 'seller/addSubcategory';
    });
    builder.addCase(addSubCategoryAction.fulfilled, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'success';
      state.message = 'Subcategory added';
      state.subcategories.push(payload);
    });
    builder.addCase(addSubCategoryAction.rejected, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'error';
      if (payload) state.message = payload;
    });

    builder.addCase(updateSubCategoryAction.pending, (state) => {
      state.apiName = 'seller/updateSubcategory';
      state.loading = 'seller/updateSubcategory';
    });
    builder.addCase(updateSubCategoryAction.fulfilled, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'success';
      state.message = 'Subcategory updated';
      state.subcategories = state.subcategories.map((sub) =>
        sub._id === payload._id ? payload : sub
      );
    });
    builder.addCase(updateSubCategoryAction.rejected, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'error';
      if (payload) state.message = payload;
    });

    builder.addCase(deleteSubCategoryAction.pending, (state) => {
      state.apiName = 'seller/deleteSubcategory';
      state.loading = 'seller/deleteSubcategory';
    });
    builder.addCase(deleteSubCategoryAction.fulfilled, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'success';
      state.message = 'Subcategory deleted';
      state.subcategories = state.subcategories.filter((s) => s._id !== payload);
    });
    builder.addCase(deleteSubCategoryAction.rejected, (state, { payload }) => {
      state.loading = '';
      state.alertType = 'error';
      if (payload) state.message = payload;
    });
  },
});

export const { clearCategoryState } = categorySlice.actions;

export default categorySlice.reducer;
