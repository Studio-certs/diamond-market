export interface IndividualDiamond {
  id: string;
  name: string;
  description: string;
  price: number;
  carat: number;
  color: string;
  clarity: string;
  cut: string;
  image_url: string;
  created_at: string;
}

export interface WholesaleDiamond {
  id: string;
  name: string;
  description: string;
  base_price_per_carat: number;
  minimum_carat: number;
  maximum_carat: number;
  color: string;
  clarity: string;
  cut: string;
  available_quantity: number;
  minimum_order_quantity: number;
  bulk_discount_percentage: number;
  image_url: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  full_name: string;
}
