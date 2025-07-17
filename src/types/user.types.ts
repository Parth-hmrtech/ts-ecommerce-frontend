
export interface ISignUpInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'buyer' | 'seller';
  profileImage?: File | string; 
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
  id?: string; // MongoDB _id or custom user ID
  email: string;
  password: string;
  full_name?: string;
  avatar?: File | string;
  role?: 'buyer' | 'seller';
   oldPassword: string;
  newPassword: string;
}
