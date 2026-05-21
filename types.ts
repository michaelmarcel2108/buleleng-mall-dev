export interface Business {
  id: string;
  name: string;
  desc: string;
}

export interface Category {
  id: string | number;
  name: string;
  color: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  image_url: string;

  // Change this from an array (Category[]) to a single object:
  categories: Category | null;
}
export interface category {
  id: string;
  name: string;
}
