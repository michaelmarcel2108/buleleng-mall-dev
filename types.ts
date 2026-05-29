export interface Business {
  id: string;
  name: string;
  slug: string;
  desc?: string;
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
  description: string;
  price: number;
  shopee_url?: string;
  image_url: string;
  categories: Category[];
  businesses: Business[];
}

export interface Banner {
  id: string;
  title: string;
  link_url: string;
  image_url: string;
  image_url_mobile: string;
  image_url_desktop: string;
  alt_text: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  image_url: string;
  created_at: string;
}
