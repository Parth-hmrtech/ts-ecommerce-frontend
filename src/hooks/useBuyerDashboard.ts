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
import type { ICartAdd, ICartItem, ICartUpdate } from '@/types/cart.types';
import type { IProduct } from '@/types/product.types'; 

const useBuyerDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { products = [], loading, error } = useSelector((state: RootState) => state.product);
  const { cart = [] } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    dispatch(fetchProductsAction());
    dispatch(fetchBuyerCartAction());
  }, [dispatch]);

  const addToCart = (payload: ICartAdd) => {
    return dispatch(addToBuyerCartAction(payload));
  };

  const updateCart = (payload: ICartUpdate) => {
    return dispatch(updateBuyerCartAction(payload));
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
