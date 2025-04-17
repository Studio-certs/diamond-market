import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Package, Gem } from 'lucide-react';
import type { IndividualDiamond, WholesaleDiamond } from '../types';

export function Marketplace() {
  const [view, setView] = useState<'individual' | 'wholesale'>('individual');
  const [individualDiamonds, setIndividualDiamonds] = useState<IndividualDiamond[]>([]);
  const [wholesaleDiamonds, setWholesaleDiamonds] = useState<WholesaleDiamond[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Fetch individual diamonds
        const { data: individualData, error: individualError } = await supabase
          .from('individual_diamonds')
          .select('*')
          .order('created_at', { ascending: false });

        if (individualError) throw individualError;
        setIndividualDiamonds(individualData || []);

        // Fetch wholesale diamonds
        const { data: wholesaleData, error: wholesaleError } = await supabase
          .from('wholesale_diamonds')
          .select('*')
          .order('created_at', { ascending: false });

        if (wholesaleError) throw wholesaleError;
        setWholesaleDiamonds(wholesaleData || []);
      } catch (err) {
        console.error('Error fetching diamonds:', err);
        setError('Failed to load diamonds. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Diamond Marketplace</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setView('individual')}
            className={`flex items-center px-4 py-2 rounded-lg ${
              view === 'individual'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Gem className="w-5 h-5 mr-2" />
            Individual Diamonds
          </button>
          <button
            onClick={() => setView('wholesale')}
            className={`flex items-center px-4 py-2 rounded-lg ${
              view === 'wholesale'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Package className="w-5 h-5 mr-2" />
            Wholesale Diamonds
          </button>
        </div>
      </div>

      {view === 'individual' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {individualDiamonds.map((diamond) => (
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
                  <div className="text-sm text-gray-500">Individual piece</div>
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
          {individualDiamonds.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No individual diamonds available at the moment.
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wholesaleDiamonds.map((diamond) => (
            <Link
              key={diamond.id}
              to={`/wholesale/${diamond.id}`}
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
                  <span className="text-2xl font-bold text-blue-600">
                    ${diamond.base_price_per_carat.toLocaleString()}/ct
                  </span>
                  <div className="text-sm text-gray-500">{diamond.available_quantity} available</div>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>Carat Range: {diamond.minimum_carat}-{diamond.maximum_carat}ct</div>
                  <div>Color: {diamond.color}</div>
                  <div>Clarity: {diamond.clarity}</div>
                  <div>Cut: {diamond.cut}</div>
                  <div className="col-span-2 text-blue-600">
                    Bulk Discount: {diamond.bulk_discount_percentage}% off
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {wholesaleDiamonds.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No wholesale diamonds available at the moment.
            </div>
          )}
        </div>
      )}
    </div>
  );
}