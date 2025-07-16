import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '@/store';
import {
  signUpUserAction,
  signInUserAction,
  forgotPasswordAction,
} from '@/store/actions/auth.actions';

import { resetAuthState } from '@/store/reducers/auth.reducer';
import type { IUser } from '@/types/user.types';

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

  const signIn = async (body: IUser) => {
    return await dispatch(signInUserAction(body));
  };

  const forgotPassword = async (body: IForgotPasswordInput) => {
    return await dispatch(forgotPasswordAction(body));
  };

  const resetAuth = () => {
    dispatch(resetAuthState());
  };

  // Clean up auth state on unmount (optional but nice to have)
  useEffect(() => {
    return () => {
      resetAuth();
    };
  }, []);

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
