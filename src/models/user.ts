export interface User {
  id?: string;
  name: string;
  cpf_cnpj: string;
  user_type: number;
  email: string;
  person_link: string;
  password?: string;
  payer_id: string;
  plan_id: string | null;
  address_id: string | undefined;
  phone: string;
  status: string;
  shipping_type?: number | null;
  shipping_taxes?: number | null;
  image_url?: string | null;
  background_color?: string | null;
}
