
export interface IUser {
  id?: string; 
  email: string;
  password: string;
  full_name?: string;
  avatar?: File | string;
  role?: 'buyer' | 'seller';
   oldPassword: string;
  newPassword: string;
  
}
