export interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

export interface UserCategory {
  id: string;
  user_id: string;
  category_id: string;
  category: {
    id: string;
    name: string;
    description: string;
    image_url: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    person_link: string;
    created_at: string;
    updated_at: string;
  };
}
