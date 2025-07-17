export interface ICategory {
  id: string;
  category_name: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface ISubCategory {
  id: string;
  sub_category_name: string;
  category_id: string;
  createdAt?: string;
  updatedAt?: string;
}
