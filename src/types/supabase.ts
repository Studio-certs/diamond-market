export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: 'admin' | 'user';
          full_name: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id: string;
          role?: 'admin' | 'user';
          full_name: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          role?: 'admin' | 'user';
          full_name?: string;
          email?: string;
          created_at?: string;
        };
      };
      individual_diamonds: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          carat: number;
          color: string;
          clarity: string;
          cut: string;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price: number;
          carat: number;
          color: string;
          clarity: string;
          cut: string;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          carat?: number;
          color?: string;
          clarity?: string;
          cut?: string;
          image_url?: string | null;
          created_at?: string;
        };
      };
      wholesale_diamonds: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          base_price_per_carat: number;
          minimum_carat: number;
          maximum_carat: number;
          color: string;
          clarity: string;
          cut: string;
          available_quantity: number;
          minimum_order_quantity: number;
          bulk_discount_percentage: number;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          base_price_per_carat: number;
          minimum_carat: number;
          maximum_carat: number;
          color: string;
          clarity: string;
          cut: string;
          available_quantity: number;
          minimum_order_quantity: number;
          bulk_discount_percentage: number;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          base_price_per_carat?: number;
          minimum_carat?: number;
          maximum_carat?: number;
          color?: string;
          clarity?: string;
          cut?: string;
          available_quantity?: number;
          minimum_order_quantity?: number;
          bulk_discount_percentage?: number;
          image_url?: string | null;
          created_at?: string;
        };
      };
    };
  };
}