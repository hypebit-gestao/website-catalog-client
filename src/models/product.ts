export interface Product {
  id: string;
  name: string;
  description: string;
  category?: {
    id: string;
    name: string;
    image_url?: string;
  };
  category_id: string | undefined;
  user_id: string | undefined;
  weight: number;
  images?: string[] | undefined;
  featured: boolean;
  currency: string;
  price: number;
  user: {
    phone: string;
  };
}
