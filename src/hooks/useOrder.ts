import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useCallback } from 'react';
import type { RootState, AppDispatch } from '@/store';

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
import type { IOrder } from '@/types/order.types';

type Role = 'buyer' | 'seller';

const useOrderManager = (role: Role = 'buyer') => {
  const dispatch = useDispatch<AppDispatch>();

  const order = useSelector((state: RootState) => state.order || {});
  const payment = useSelector((state: RootState) => state.payment || {});
  const review = useSelector((state: RootState) => state.review || {});
  const product = useSelector((state: RootState) => state.product || {});

  const products = product.products || [];
  const buyerReviews = review.buyerReviews || [];
  const buyerCheckPayments = payment.buyerPayment;

  const fetchBuyerOrders = useCallback(() => {
    dispatch(fetchBuyerOrdersAction());
  }, [dispatch]);
const deleteBuyerOrder = useCallback((orderId: string) => {
  dispatch(deleteBuyerOrderAction(orderId));
}, [dispatch]);


const updateBuyerOrderAddress = useCallback(
  (payload: { orderId: string; delivery_address: string }) => {
    dispatch(updateBuyerOrderAddressAction(payload));
  },
  [dispatch]
);

  const fetchPaymentStatus = useCallback(() => {
    dispatch(buyerCheckPaymentStatusAction()); 
  }, [dispatch]);

  const checkoutPayment = useCallback((payload: any) => {
    dispatch(buyerCheckoutPaymentAction(payload));
  }, [dispatch]);

  const verifyPayment = useCallback((payload: any) => {
    dispatch(buyerVerifyPaymentAction(payload));
  }, [dispatch]);

  const addReview = useCallback((payload: any) => {
    dispatch(addBuyerReviewAction(payload));
  }, [dispatch]);

  const updateReview = useCallback((payload: any) => {
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
    } else if (role === 'seller') {
      fetchSellerOrders();
      fetchSellerProducts();
    }
  }, [role, fetchBuyerOrders, fetchPaymentStatus, fetchSellerOrders, fetchSellerProducts]);

  return {
    role,

    products,
    orders: order.buyerOrders || [],
    loading: order.loading || false,
    error: order.error || null,
    buyerCheckPayments,
    buyerReviews,

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

    sellerOrders: order.sellerOrders || [],
    sellerProducts: product.products || [],
    fetchSellerOrders,
    fetchSellerProducts,
    updateOrderStatus,
  };
};

export default useOrderManager;
