import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Diamond {
  id: string;
  name: string;
  description: string | null;
  price: number;
  carat: number;
  color: string;
  clarity: string;
  cut: string;
  image_url: string | null;
  type: 'individual' | 'bulk';
  quantity: number | null;
}

export function Marketplace() {
  const [diamonds, setDiamonds] = useState<Diamond[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDiamonds() {
      try {
        const { data, error } = await supabase
          .from('diamonds')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setDiamonds(data || []);
      } catch (error) {
        console.error('Error fetching diamonds:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDiamonds();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Diamond Marketplace</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {diamonds.map((diamond) => (
          <Link
            key={diamond.id}
            to={`/product/${diamond.id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="aspect-w-1 aspect-h-1">
              <img
                src={diamond.image_url || 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80'}
                alt={diamond.name}
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{diamond.name}</h2>
              <p className="text-gray-600 mb-2 line-clamp-2">{diamond.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">${diamond.price.toLocaleString()}</span>
                <div className="text-sm text-gray-500">
                  {diamond.type === 'bulk' ? `${diamond.quantity} available` : 'Individual piece'}
                </div>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-600">
                <div>Carat: {diamond.carat}</div>
                <div>Color: {diamond.color}</div>
                <div>Clarity: {diamond.clarity}</div>
                <div>Cut: {diamond.cut}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
