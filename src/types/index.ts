export interface Diamond {
  id: string;
  name: string;
  description: string;
  price: number;
  carat: number;
  color: string;
  clarity: string;
  cut: string;
  image_url: string;
  type: 'individual' | 'bulk';
  quantity?: number;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  full_name: string;
}