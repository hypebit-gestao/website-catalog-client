export interface Store {
  id?: string;
  name: string;
  phone: string;
  image_url: string;
  email: string;
  shipping_taxes: number;
  shipping_type: number;
  background_color: string;
  pix_discount: number | null;
  credit_discount: number | null;
  debit_discount: number | null;
}
