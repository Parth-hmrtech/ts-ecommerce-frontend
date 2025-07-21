import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/store'; 

import {
  fetchSellerPaymentsAction,
  fetchSellerEarningsAction,
} from '@/store/actions/payment.action';

const useSellerPayment = () => {
  const dispatch = useDispatch<AppDispatch>();

  const fetchSellerPayments = () => {
    return dispatch(fetchSellerPaymentsAction());
  };

  const fetchSellerEarnings = () => {
    return dispatch(fetchSellerEarningsAction());
  };

  const sellerPayments = useSelector((state: RootState) => state.payment);

  return {
    fetchSellerPayments,
    fetchSellerEarnings,
    sellerPayments,
  };
};

export default useSellerPayment;
