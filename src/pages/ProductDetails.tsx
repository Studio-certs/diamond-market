import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Diamond {
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
}

export function ProductDetails() {
  const { id } = useParams();
  const [diamond, setDiamond] = useState<Diamond | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDiamond() {
      try {
        const { data, error } = await supabase
          .from('diamonds')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setDiamond(data);
      } catch (error) {
        console.error('Error fetching diamond:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDiamond();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!diamond) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Product not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
        {/* Image */}
        <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
          <img
            src={diamond.image_url || 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80'}
            alt={diamond.name}
            className="w-full h-full object-center object-cover"
          />
        </div>

        {/* Product info */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{diamond.name}</h1>
          <div className="mt-3">
            <p className="text-3xl text-gray-900">${diamond.price.toLocaleString()}</p>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900">Details</h3>
            <div className="mt-4 space-y-6">
              <p className="text-sm text-gray-600">{diamond.description}</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Carat</h4>
                <p className="mt-1 text-sm text-gray-500">{diamond.carat}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Color</h4>
                <p className="mt-1 text-sm text-gray-500">{diamond.color}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Clarity</h4>
                <p className="mt-1 text-sm text-gray-500">{diamond.clarity}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Cut</h4>
                <p className="mt-1 text-sm text-gray-500">{diamond.cut}</p>
              </div>
              {diamond.type === 'bulk' && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Quantity</h4>
                  <p className="mt-1 text-sm text-gray-500">{diamond.quantity}</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex">
            <button
              type="button"
              className="w-full bg-blue-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Contact for Purchase
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
