export interface Product {
  id: string;
  name: string;
  description?: string | null;
  promotion_price?: number | null;
  category?: {
    id: string;
    name: string;
    image_url?: string;
  };
  product_size?: {
    size: {
      id: string;
      size: string;
    };
  }[];
  product_attribute?: {
    attribute: {
      id: string;
      name: string;
      type: number;
      attributeOption?: {
        id: string;
        option_name: string;
      }[];
    };
  }[];
  category_id?: string;
  user_id?: string;
  weight?: number;
  images?: string[];
  featured?: boolean;
  active?: boolean;
  currency?: string;
  price: number;
  user?: {
    phone?: string;
  };

  // Installment/payment fields (optional)
  installment_available?: boolean;
  installment_with_interest?: boolean;
  installment_interest_value?: number; // percentage, ex: 2.5
  max_installments?: number; // integer >= 1
}
