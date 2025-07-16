// src/types/auth.types.ts

export interface ISignUpInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'buyer' | 'seller';
  profileImage?: File | string; // optional profile picture
}

export interface ISignInInput {
  email: string;
  password: string;
  role: 'buyer' | 'seller';
}

export interface IForgotPasswordInput {
  email: string;
  role: 'buyer' | 'seller';
}
export interface IUser {
  email: string;
  password: string;
  full_name?: string;          
  avatar?: File | string;       
  role?: 'buyer' | 'seller';
}
