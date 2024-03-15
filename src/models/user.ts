export interface User {
  id?: string;
  name: string;
  cpf_cnpj: string;
  user_type: number;
  email: string;
  person_link: string;
  password?: string;
  payer_id: string;
  address_id: string | undefined;
  phone: string;
  status: string;
  shipping_type?: string;
  shipping_taxes?: number;
  image_url?: string | null;
}
