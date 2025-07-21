import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store';

import { fetchSellerReviewsAction } from '@/store/actions/review.action';
import { fetchProductsAction } from '@/store/actions/product.action';
import {
  fetchSellerPaymentsAction,
  fetchSellerEarningsAction,
} from '@/store/actions/payment.action';
import { fetchSellerOrdersAction } from '@/store/actions/order.action';

import type { IProduct } from '@/types/product.types';
import type { IReview } from '@/types/review.types';

const useSellerDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    sellerReviews = [],
    loading: reviewLoading,
  } = useSelector((state: RootState) => state.review || {});

  const {
    products = [],
    loading: productLoading,
  } = useSelector((state: RootState) => state.product || {});

  const {
    sellerEarnings = { total_earnings: 0, total_orders: 0 },
    loading: paymentLoading,
  } = useSelector((state: RootState) => state.payment || {});

  const {
    sellerOrders = [],
    loading: orderLoading,
  } = useSelector((state: RootState) => state.order || {});

  const totalProducts = products.length;
  const totalOrders = sellerOrders.length;
  const totalReviews = sellerReviews.length;

  const totalEarnings =
    !Array.isArray(sellerEarnings) && sellerEarnings?.total_earnings
      ? sellerEarnings.total_earnings
      : 0;

  const sellerProductIds: string[] = products.map((p: IProduct) => p._id || p.id);

  const filteredReviews = sellerReviews.filter(
    (review: IReview) =>
      typeof review.product_id === 'string' &&
      !!review.product_id &&
      sellerProductIds.includes(review.product_id)
  );

  const totalRating = filteredReviews.reduce((sum, review) => {
    const rating = review.rating !== undefined ? Number(review.rating) : 0;
    return sum + rating;
  }, 0);

  const averageRating: string =
    filteredReviews.length > 0 ? (totalRating / filteredReviews.length).toFixed(1) : '0.0';

  const isLoading =
    !!reviewLoading || !!productLoading || !!paymentLoading || !!orderLoading;

  useEffect(() => {
    const fetchAll = async () => {
      await dispatch(fetchSellerReviewsAction());
      await dispatch(fetchProductsAction());
      await dispatch(fetchSellerPaymentsAction());
      await dispatch(fetchSellerEarningsAction());
      await dispatch(fetchSellerOrdersAction());
    };
    fetchAll();
  }, [dispatch]);

  return {
    isLoading,
    totalProducts,
    totalOrders,
    totalEarnings,
    totalReviews,
    averageRating,
  };
};

export default useSellerDashboard;
