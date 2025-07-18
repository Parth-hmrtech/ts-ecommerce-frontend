export interface IUser {
  id?: string; 
  email: string;
  password: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  image_url?: string;
  avatar?: File | string;
  role?: 'buyer' | 'seller';
  oldPassword?: string;
  newPassword?: string;
  data?: FormData;
  [key: string]: any; }


export interface IUpdateUser {
  id: string;
  data: FormData;
}

export interface IResetUserPassword {
  oldPassword: string;
  newPassword: string;
}

export interface ISign {
  email: string;
  password: string;
  role?: 'buyer' | 'seller';
}
