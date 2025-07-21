import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import type { AppDispatch, RootState } from '@/store';

import {
  fetchProductsAction,
  fetchBuyerProductByIdAction,
  fetchBuyerWishlistAction,
  addToBuyerWishlistAction,
  deleteFromBuyerWishlistAction,
  fetchAllProductsAction,
  addProductAction,
  deleteProductAction,
  updateProductAction,
  uploadProductImageAction,
} from '@/store/actions/product.action';

import {
  fetchBuyerCartAction,
  addToBuyerCartAction,
  updateBuyerCartAction,
  deleteBuyerCartAction,
} from '@/store/actions/cart.action';

import {
  fetchBuyerReviewByProductIdAction,
  updateBuyerReviewAction,
  deleteBuyerReviewAction,
  fetchSellerReviewsAction,
  deleteSellerReviewAction,
} from '@/store/actions/review.action';

import {
  fetchAllCategoriesAction,
  fetchAllSubCategoriesByIdAction,
} from '@/store/actions/category.action';

import type { ICartAdd, ICartUpdate } from '@/types/cart.types';
import type { IAddProduct, IProduct, IWishlistAdd } from '@/types/product.types';
import type { IReview } from '@/types/review.types';

const useProductManager = (productId?: string) => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    productDetail = {} as IProduct,
    products = [],
    buyerWishlist = [],
    loading = false,
    error = null,
  } = useSelector((state: RootState) => state.product || {});

  const {
    cart = [],
  } = useSelector((state: RootState) => state.cart || {});

const {
  buyerReviews = [],
  sellerReviews = [],
} = useSelector((state: RootState) => state.review || {});

  const {
    list: sellerCategories = [],
    subcategoriesByCategory: sellerSubcategories = [],
  } = useSelector((state: RootState) => state.category || {});

  const fetchProduct = async () => {
    if (productId) {
      return await dispatch(fetchBuyerProductByIdAction(productId));
    }
  };

  const fetchBuyerProducts = async () => {
    return await dispatch(fetchProductsAction());
  };

  const fetchWishlist = async () => {
    return await dispatch(fetchBuyerWishlistAction());
  };

  const fetchCart = async () => {
    return await dispatch(fetchBuyerCartAction());
  };

  const fetchReviews = async (id: string) => {
    if (id) {
      return await dispatch(fetchBuyerReviewByProductIdAction(id));
    }
  };

  const addToCart = async (payload: ICartAdd) => {
    return await dispatch(addToBuyerCartAction(payload));
  };

  const updateCart = async (payload: ICartUpdate) => {
    return await dispatch(updateBuyerCartAction(payload));
  };

  const deleteCartItem = async (id: string) => {
    return await dispatch(deleteBuyerCartAction(id));
  };

  const addToWishlist = async (payload: IWishlistAdd) => {
    return await dispatch(addToBuyerWishlistAction(payload));
  };

  const deleteFromWishlist = async (productId: string) => {
    await dispatch(deleteFromBuyerWishlistAction(productId));
    await dispatch(fetchBuyerWishlistAction());
  };

  const updateReview = async (payload: IReview) => {
    return await dispatch(updateBuyerReviewAction(payload));
  };

  const deleteReview = async (id: string) => {
    return await dispatch(deleteBuyerReviewAction(id));
  };

  const fetchAllProducts = async () => {
    return await dispatch(fetchAllProductsAction());
  };

  const fetchSellerProducts = fetchAllProducts;

  const addSellerProduct = async (payload: IAddProduct) => {
    return await dispatch(addProductAction(payload));
  };

  const deleteSellerProduct = async (id: string) => {
    return await dispatch(deleteProductAction(id));
  };

  const updateSellerProduct = async (payload: IProduct) => {
    return await dispatch(updateProductAction(payload));
  };

  const uploadProductImage = async (formData: FormData) => {
    return await dispatch(uploadProductImageAction(formData));
  };

  const fetchSellerCategories = async () => {
    return await dispatch(fetchAllCategoriesAction());
  };

  const fetchSellerSubcategoriesByCategoryId = async (categoryId: string) => {
    return await dispatch(fetchAllSubCategoriesByIdAction(categoryId));
  };

  const fetchSellerReviews = async () => {
    return await dispatch(fetchSellerReviewsAction());
  };

  const deleteSellerReview = async (id: string) => {
    return await dispatch(deleteSellerReviewAction(id));
  };

  useEffect(() => {
    fetchWishlist();
    fetchBuyerProducts();
    fetchCart();
  }, []);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    if (productDetail?.id) {
      fetchReviews(productDetail.id);
    }
  }, [productDetail?.id]);

  return {
    product: productDetail,
    products,
    wishlist: buyerWishlist,
    cart,
    reviewResponses: buyerReviews,
    loading,
    error,

    fetchProduct,
    fetchBuyerProducts,
    fetchCart,
    fetchWishlist,
    fetchReviews,
    addToCart,
    updateCart,
    deleteCartItem,
    addToWishlist,
    deleteFromWishlist,
    updateReview,
    deleteReview,

    sellerProducts: products,
    sellerCategories,
    sellerSubcategories,
    sellerReviews,
    sellerLoading: loading,
    sellerError: error,
    fetchAllProducts,
    fetchSellerProducts,
    addSellerProduct,
    deleteSellerProduct,
    updateSellerProduct,
    uploadProductImage,
    fetchSellerCategories,
    fetchSellerSubcategoriesByCategoryId,
    fetchSellerReviews,
    deleteSellerReview,
  };
};

export default useProductManager;
