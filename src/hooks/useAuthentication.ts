import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '@/store';
import {
  signUpUserAction,
  signInUserAction,
  forgotPasswordAction,
} from '@/store/actions/auth.actions';

import { resetAuth as resetAuthAction } from '@/store/reducers/auth.reducer';
import type { ISign } from '@/types/user.types';

interface IForgotPasswordInput {
  email: string;
  role: 'buyer' | 'seller';
}

const useAuthentication = () => {
  const dispatch: AppDispatch = useDispatch();
  const {
    user,
    loading,
    error,
    success,
    message,
    apiName,
    alertType,
  } = useSelector((state: RootState) => state.auth);
  const signUp = async (body: FormData) => {
    return await dispatch(signUpUserAction(body));
  };

  const signIn = async (body: ISign) => {
    return await dispatch(signInUserAction(body));
  };

  const forgotPassword = async (body: IForgotPasswordInput) => {
    return await dispatch(forgotPasswordAction(body));
  };

  const resetAuth = () => {
    dispatch(resetAuthAction());
  };

  useEffect(() => {
    return () => {
      dispatch(resetAuthAction());
    };
  }, [dispatch]);

  return {
    user,
    loading,
    error,
    success,
    message,
    apiName,
    alertType,
    signUp,
    signIn,
    forgotPassword,
    resetAuth,
  };
};

export default useAuthentication;
