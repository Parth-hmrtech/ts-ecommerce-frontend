export interface ICategory {
  id: string;
  category_name: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface IAddCategory {
  category_name: string;
}
export interface ISubCategory {
  id: string;
  sub_category_name: string;
  category_id: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface IAddSubCategory {
  category_id: string;
  sub_category_name: string;
}

export interface IUpdateSubCategory {
  id: string;
  sub_category_name: string;
  category_id?: string | null;
}