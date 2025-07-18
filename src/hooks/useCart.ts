import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchBuyerCartAction,
  updateBuyerCartAction,
  deleteBuyerCartAction,
  deleteBuyerIdCartAction,
} from '@/store/actions/cart.action';

import { fetchProductsAction } from '@/store/actions/product.action';
import { placeBuyerOrderAction } from '@/store/actions/order.action';

import type { RootState, AppDispatch } from '@/store';
import type { ICartUpdate } from '@/types/cart.types';
import type { IOrderPayload } from '@/types/order.types';

const useBuyerCart = () => {
  const dispatch = useDispatch<AppDispatch>();

const { cart, updatedCart, loading, error } = useSelector(
  (state: RootState) => state.cart
);
  const { products } = useSelector((state: RootState) => state.product);

  const fetchCart = () => {
    return dispatch(fetchBuyerCartAction());
  };

  const fetchProducts = () => {
    return dispatch(fetchProductsAction());
  };

  const updateCartItem = (payload: ICartUpdate) => {
    return dispatch(updateBuyerCartAction(payload));
  };

  const deleteCartItem = (id: string) => {
    return dispatch(deleteBuyerCartAction(id));
  };

  const deleteCartByBuyerId = (buyerId: string) => {
    return dispatch(deleteBuyerIdCartAction(buyerId));
  };

  const placeOrder = (payload: IOrderPayload) => {
    return dispatch(placeBuyerOrderAction(payload));
  };

  useEffect(() => {
    fetchCart();
    fetchProducts();
  }, []); 

  return {
    cart,
    updatedCart,
    loading,
    error,
    products,
    fetchCart,
    fetchProducts,
    updateCartItem,
    deleteCartItem,
    deleteCartByBuyerId,
    placeOrder,
  };
};

export default useBuyerCart;
