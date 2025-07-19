import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllCategoriesAction,
  addCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
  fetchAllSubCategoriesAction,
  addSubCategoryAction,
  updateSubCategoryAction,
  deleteSubCategoryAction,
} from '@/store/actions/category.action';
import type { AppDispatch, RootState } from '@/store';
import type { ICategory, IAddCategory, ISubCategory, IAddSubCategory, IUpdateSubCategory } from '@/types/category.types'; // adjust this import path if needed

const useSellerCategory = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    list: categories = [],
    subcategories: subCategories = [],
    loading = '',
    error = false,
    message = '',
  }: {
    list: ICategory[];
    subcategories: ISubCategory[];
    loading: string;
    error: string | boolean;
    message: string;
  } = useSelector((state: RootState) => state.category || {});

  const categoryLoading = loading.includes('Category');
  const subCategoryLoading = loading.includes('Subcategory');
  const categoryError = error;
  const subCategoryError = error;

  const fetchCategories = async () => {
    return await dispatch(fetchAllCategoriesAction());
  };

  const addCategory = async (payload: IAddCategory) => {
    return await dispatch(addCategoryAction(payload));
  };

  const updateCategory = (payload: ICategory) => {
    return dispatch(updateCategoryAction(payload));
  };

  const deleteCategory = async (id: string) => {
    return await dispatch(deleteCategoryAction(id));
  };

  const fetchSubCategories = async () => {
    return await dispatch(fetchAllSubCategoriesAction());
  };

  const addSubCategory = (payload: IAddSubCategory) => {
    return dispatch(addSubCategoryAction(payload));
  };
const updateSubCategory = async (params: IUpdateSubCategory) => {
  return await dispatch(updateSubCategoryAction(params));
};
  const deleteSubCategory = async (id: string) => {
    return await dispatch(deleteSubCategoryAction(id));
  };

  return {
    categories,
    categoryLoading,
    categoryError,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,

    subCategories,
    subCategoryLoading,
    subCategoryError,
    fetchSubCategories,
    addSubCategory,
    updateSubCategory,
    deleteSubCategory,
    message,
  };
};

export default useSellerCategory;
