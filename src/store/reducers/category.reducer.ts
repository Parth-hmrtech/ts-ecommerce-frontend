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
import type { ICategory, ISubCategory } from '@/types/category.types';

interface CategoryState {
  list: ICategory[];
  subcategories: ISubCategory[];
  subcategoriesByCategory: ISubCategory[];
  loading: string;
  apiName: string;
  alertType: string;
  message: string;
  error: boolean;
}

const initialState: CategoryState = {
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
    builder

      .addCase(fetchAllCategoriesAction.pending, (state) => {
        state.apiName = 'seller/fetchCategories';
        state.loading = 'seller/fetchCategories';
      })
      .addCase(fetchAllCategoriesAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'success';
        state.message = 'Categories fetched successfully';
        state.list = payload.data || [];
        state.error = false;
      })
      .addCase(fetchAllCategoriesAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) state.message = payload.message;
      })

      .addCase(addCategoryAction.pending, (state) => {
        state.apiName = 'seller/addCategory';
        state.loading = 'seller/addCategory';
      })
      .addCase(addCategoryAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'success';
        state.message = 'Category added successfully';
        state.list.push(payload);
        state.error = false;
      })
      .addCase(addCategoryAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) state.message = payload.message;
      })

      .addCase(updateCategoryAction.pending, (state) => {
        state.apiName = 'seller/updateCategory';
        state.loading = 'seller/updateCategory';
      })
      .addCase(updateCategoryAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'success';
        state.message = 'Category updated successfully';
        state.list = state.list.map((cat) =>
          cat.id === payload._id ? payload : cat
        );
        state.error = false;
      })
      .addCase(updateCategoryAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) state.message = payload.message;
      })

      .addCase(deleteCategoryAction.pending, (state) => {
        state.apiName = 'seller/deleteCategory';
        state.loading = 'seller/deleteCategory';
      })
      .addCase(deleteCategoryAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'success';
        state.message = 'Category deleted successfully';
        state.list = state.list.filter((cat) => cat.id !== payload);
        state.error = false;
      })
      .addCase(deleteCategoryAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) state.message = payload.message;
      })

      .addCase(fetchBuyerCategoriesAction.pending, (state) => {
        state.apiName = 'buyer/fetchCategories';
        state.loading = 'buyer/fetchCategories';
      })
      .addCase(fetchBuyerCategoriesAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'success';
        state.message = 'Buyer categories fetched';
        state.list = payload || [];
        state.error = false;
      })
      .addCase(fetchBuyerCategoriesAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) state.message = payload.message;
      })

      .addCase(fetchAllSubCategoriesAction.pending, (state) => {
        state.apiName = 'seller/fetchSubcategories';
        state.loading = 'seller/fetchSubcategories';
      })
      .addCase(fetchAllSubCategoriesAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'success';
        state.message = 'Subcategories fetched';
        state.subcategories = payload.data || [];
        state.error = false;
      })
      .addCase(fetchAllSubCategoriesAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) state.message = payload.message;
      })

      .addCase(fetchAllSubCategoriesByIdAction.pending, (state) => {
        state.apiName = 'seller/fetchSubcategoriesByCategory';
        state.loading = 'seller/fetchSubcategoriesByCategory';
      })
      .addCase(fetchAllSubCategoriesByIdAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.subcategoriesByCategory = payload.data || [];
        state.alertType = 'success';
        state.message = 'Subcategories by category fetched';
        state.error = false;
      })
      .addCase(fetchAllSubCategoriesByIdAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) state.message = payload.message;
      })

      .addCase(addSubCategoryAction.pending, (state) => {
        state.apiName = 'seller/addSubcategory';
        state.loading = 'seller/addSubcategory';
      })
      .addCase(addSubCategoryAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'success';
        state.message = 'Subcategory added';
        state.subcategories.push(payload);
        state.error = false;
      })
      .addCase(addSubCategoryAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) state.message = payload.message;
      })

      .addCase(updateSubCategoryAction.pending, (state) => {
        state.apiName = 'seller/updateSubcategory';
        state.loading = 'seller/updateSubcategory';
      })
      .addCase(updateSubCategoryAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'success';
        state.message = 'Subcategory updated';
        state.subcategories = state.subcategories.map((sub) =>
          sub.id === payload._id ? payload : sub
        );
        state.error = false;
      })
      .addCase(updateSubCategoryAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) state.message = payload.message;
      })

      .addCase(deleteSubCategoryAction.pending, (state) => {
        state.apiName = 'seller/deleteSubcategory';
        state.loading = 'seller/deleteSubcategory';
      })
      .addCase(deleteSubCategoryAction.fulfilled, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'success';
        state.message = 'Subcategory deleted';
        state.subcategories = state.subcategories.filter((s) => s.id !== payload);
        state.error = false;
      })
      .addCase(deleteSubCategoryAction.rejected, (state, { payload }: any) => {
        state.loading = '';
        state.alertType = 'error';
        if (payload) state.message = payload.message;
      });
  },
});

export const { clearCategoryState } = categorySlice.actions;
export default categorySlice.reducer;
