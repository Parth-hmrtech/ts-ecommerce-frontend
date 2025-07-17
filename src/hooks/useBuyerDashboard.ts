import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';
import { fetchProductsAction } from '@/store/actions/product.action';
import {
  fetchBuyerCartAction,
  addToBuyerCartAction,
  updateBuyerCartAction,
  deleteBuyerCartAction,
} from '@/store/actions/cart.action';
import type { ICartItem } from '@/types/cart.types';
import type { IProduct } from '@/types/product.types'; // Make sure this exists

const useBuyerDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { products = [], loading, error } = useSelector((state: RootState) => state.product);
  const { cart = [] } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    dispatch(fetchProductsAction());
    dispatch(fetchBuyerCartAction());
  }, [dispatch]);

  const addToCart = (product_id: string, quantity: number) => {
    return dispatch(addToBuyerCartAction({ product_id, quantity }));
  };

  const updateCart = (id: string, quantity: number) => {
    return dispatch(updateBuyerCartAction({ id, quantity }));
  };

  const deleteFromCart = (id: string) => {
    return dispatch(deleteBuyerCartAction(id));
  };

  const refreshCart = () => {
    return dispatch(fetchBuyerCartAction());
  };

  return {
    products: products as IProduct[],
    cart: cart as ICartItem[],
    loading,
    error,
    addToCart,
    updateCart,
    deleteFromCart,
    refreshCart,
  };
};

export default useBuyerDashboard;
