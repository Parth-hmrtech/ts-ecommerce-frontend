import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useCallback } from 'react';

import type { RootState, AppDispatch } from '@/store';
import type { IOrder,IOrderAddressUpdate } from '@/types/order.types';
import type { IReview ,IReviewAdd } from '@/types/review.types';
import type { IPayment } from '@/types/payment.types';

import {
  fetchBuyerOrdersAction,
  deleteBuyerOrderAction,
  updateBuyerOrderAddressAction,
  fetchSellerOrdersAction,
  updateOrderStatusAction,
} from '@/store/actions/order.action';

import {
  buyerCheckoutPaymentAction,
  buyerVerifyPaymentAction,
  buyerCheckPaymentStatusAction,
} from '@/store/actions/payment.action';

import {
  addBuyerReviewAction,
  updateBuyerReviewAction,
  deleteBuyerReviewAction,
  fetchBuyerReviewByProductIdAction,
} from '@/store/actions/review.action';

import { fetchProductsAction } from '@/store/actions/product.action';

type Role = 'buyer' | 'seller';

const useOrderManager = (role: Role = 'buyer') => {
  const dispatch = useDispatch<AppDispatch>();

  const order = useSelector((state: RootState) => state.order);
  const payment = useSelector((state: RootState) => state.payment);
  const review = useSelector((state: RootState) => state.review);
  const product = useSelector((state: RootState) => state.product);

  const products = product.products || [];
  const buyerReviews: IReview[] = review.buyerReviews || [];
  const buyerCheckPayments = payment.buyerPayment;

  const fetchBuyerOrders = useCallback(() => {
    dispatch(fetchBuyerOrdersAction());
  }, [dispatch]);

  const deleteBuyerOrder = useCallback((orderId: string) => {
    dispatch(deleteBuyerOrderAction(orderId));
  }, [dispatch]);

  const updateBuyerOrderAddress = useCallback((payload: IOrderAddressUpdate) => {
    dispatch(updateBuyerOrderAddressAction(payload));
  }, [dispatch]);

  const fetchPaymentStatus = useCallback(() => {
    dispatch(buyerCheckPaymentStatusAction());
  }, [dispatch]);

  const checkoutPayment = useCallback((payload: IPayment) => {
    dispatch(buyerCheckoutPaymentAction(payload));
  }, [dispatch]);

  const verifyPayment = useCallback((payload: IPayment) => {
    dispatch(buyerVerifyPaymentAction(payload));
  }, [dispatch]);

  const addReview = useCallback((payload: IReviewAdd) => {
    dispatch(addBuyerReviewAction(payload));
  }, [dispatch]);

  const updateReview = useCallback((payload: IReview) => {
    dispatch(updateBuyerReviewAction(payload));
  }, [dispatch]);

  const deleteReview = useCallback((reviewId: string) => {
    dispatch(deleteBuyerReviewAction(reviewId));
  }, [dispatch]);

  const fetchReviewsByProductId = useCallback((productId: string) => {
    if (productId) {
      dispatch(fetchBuyerReviewByProductIdAction(productId));
    }
  }, [dispatch]);

  const fetchSellerOrders = useCallback(() => {
    dispatch(fetchSellerOrdersAction());
  }, [dispatch]);

  const fetchSellerProducts = useCallback(() => {
    dispatch(fetchProductsAction());
  }, [dispatch]);

  const updateOrderStatus = useCallback((payload: IOrder) => {
    dispatch(updateOrderStatusAction(payload));
  }, [dispatch]);

  useEffect(() => {
    if (role === 'buyer') {
      fetchBuyerOrders();
      fetchPaymentStatus();
      fetchSellerProducts();
    } else {
      fetchSellerOrders();
      fetchSellerProducts();
    }
  }, [role, fetchBuyerOrders, fetchPaymentStatus, fetchSellerOrders, fetchSellerProducts]);

  return {
    role,

    // Common
    products,
    buyerCheckPayments,
    buyerReviews,

    // Buyer
    orders: order.buyerOrders || [],
    loading: order.loading || false,
    error: order.error || null,
    fetchOrders: fetchBuyerOrders,
    deleteOrder: deleteBuyerOrder,
    updateOrderAddress: updateBuyerOrderAddress,
    fetchPaymentStatus,
    checkoutPayment,
    verifyPayment,

    addReview,
    updateReview,
    deleteReview,
    fetchReviewsByProductId,

    // Seller
    sellerOrders: order.sellerOrders || [],
    sellerProducts: product.products || [],
    fetchSellerOrders,
    fetchSellerProducts,
    updateOrderStatus,
  };
};

export default useOrderManager;
