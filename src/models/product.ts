export interface Product {
  id: string;
  name: string;
  description: string;
  promotion_price: number;
  category?: {
    id: string;
    name: string;
    image_url?: string;
  };
  product_size?: [
    {
      size: {
        id: string;
        size: string;
      };
    }
  ];
  product_attribute?: [
    {
      attribute: {
        id: string;
        name: string;
        type: number;
        attributeOption?: [
          {
            id: string;
            option_name: string;
          }
        ]
      };
    }
  ];
  category_id: string | undefined;
  user_id: string | undefined;
  weight: number;
  images?: string[] | undefined;
  featured: boolean;
  active: boolean;
  currency: string;
  price: number;
  user: {
    phone: string;
  };
}
