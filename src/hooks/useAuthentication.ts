import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from '@/store/index';
import {
  signUpUserAction,
  signInUserAction,
  forgotPasswordAction,
} from "@/store/actions/auth.actions";

import { resetAuthState } from "@/store/reducers/auth.reducer";
import type { IUser } from "@/types/user.types";
const useAuthentication = () => {
  const {
    user,
    loading,
    error,
    success,
    message,
  } = useSelector((state: RootState) => state.auth);

  const dispatch: AppDispatch = useDispatch();

  const signUp = async (body: FormData) => {
    return await dispatch(signUpUserAction(body));
  };

  const signIn = async (body: IUser) => {
    return await dispatch(signInUserAction(body));
  };

  const forgotPassword = async (body: { email: string; role: string }) => {
    return await dispatch(forgotPasswordAction(body));
  };

  const resetAuth = () => {
    dispatch(resetAuthState());
  };

  useEffect(() => {
    return () => {
      resetAuth();
    };
  }, [dispatch]);

  return {
    user,
    loading,
    error,
    success,
    message,
    signUp,
    signIn,
    forgotPassword,
    resetAuth,
  };
};

export default useAuthentication;
