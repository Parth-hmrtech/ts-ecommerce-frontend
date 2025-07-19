import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchSellerReviewsAction } from '@/store/actions/review.action';
import { fetchAllProductsAction } from '@/store/actions/product.action';
import {
  fetchSellerPaymentsAction,
  fetchSellerEarningsAction,
} from '@/store/actions/payment.action';
import { fetchSellerOrdersAction } from '@/store/actions/order.action';

import type { AppDispatch, RootState } from '@/store';
import type { IProduct } from '@/types/product.types';
import type { IReview } from '@/types/review.types';
import type { IOrder } from '@/types/order.types';
import type { IPayment } from '@/types/payment.types';

const useSellerDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();

  const reviewState = useSelector((state: RootState) => state.review || {});
  const productState = useSelector((state: RootState) => state.product || {});
  const paymentState = useSelector((state: RootState) => state.payment || {});
  const orderState = useSelector((state: RootState) => state.order || {});

  const reviews: IReview[] = reviewState.sellerReviews || [];
  const reviewLoading: string = reviewState.loading;

  const products: IProduct[] = productState.products || [];
  const productLoading: string = productState.loading;

  const payments: IPayment[] = paymentState.sellerPayments || [];
  const earnings: IPayment = paymentState.sellerEarnings || { total_earnings: 0 };
  const paymentLoading: string = paymentState.loading;

  const orders: IOrder[] = orderState.sellerOrders || [];
  const orderLoading: string = orderState.loading;

  const sellerProductIds = products
    .map((p) => p._id || p.id)
    .filter((id): id is string => typeof id === 'string');

  const filteredReviews = reviews.filter(
    (review) => review.product_id && sellerProductIds.includes(review.product_id)
  );


  const totalReviews = filteredReviews.length;

  const totalRating = filteredReviews.reduce(
    (sum, review) => sum + (review.rating ?? 0),
    0
  );

  const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : '0.0';

  const totalProducts = products.length;
  const filteredOrders = Array.isArray(orders)
    ? orders.filter((order) =>
      order.order_items?.some((item) => sellerProductIds.includes(item.product_id))) 
    : [];


  const totalOrders = filteredOrders.length;
  const totalEarnings = earnings?.total_earnings || 0;

  const isLoading = reviewLoading || productLoading || paymentLoading || orderLoading;

  const fetchSellerReviews = async () => {
    return await dispatch(fetchSellerReviewsAction());
  };

  const fetchSellerProducts = async () => {
    return await dispatch(fetchAllProductsAction());
  };

  const fetchSellerPayments = async () => {
    return await dispatch(fetchSellerPaymentsAction());
  };

  const fetchSellerEarnings = async () => {
    return await dispatch(fetchSellerEarningsAction());
  };

  const fetchSellerOrders = async () => {
    return await dispatch(fetchSellerOrdersAction());
  };

  const refreshDashboard = async () => {
    await fetchSellerReviews();
    await fetchSellerProducts();
    await fetchSellerPayments();
    await fetchSellerEarnings();
    await fetchSellerOrders();
  };

  useEffect(() => {
    refreshDashboard();
  }, [dispatch]);

  return {
    isLoading,
    totalProducts,
    totalOrders,
    totalEarnings,
    totalReviews,
    averageRating,
    refreshDashboard,
    reviews,
    products,
    payments,
    orders,
    earnings,
  };
};

export default useSellerDashboard;
