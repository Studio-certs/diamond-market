import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Package, Gem, Star, Filter, Search } from 'lucide-react';
import type { IndividualDiamond, WholesaleDiamond } from '../types';

export function Marketplace() {
  const [view, setView] = useState<'individual' | 'wholesale'>('individual');
  const [individualDiamonds, setIndividualDiamonds] = useState<IndividualDiamond[]>([]);
  const [wholesaleDiamonds, setWholesaleDiamonds] = useState<WholesaleDiamond[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredIndividualDiamonds = individualDiamonds.filter(diamond =>
    diamond.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    diamond.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredWholesaleDiamonds = wholesaleDiamonds.filter(diamond =>
    diamond.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    diamond.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Loading diamonds...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex items-center justify-center text-red-500 mb-4">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-center text-gray-800 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with View Switcher */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Diamond Marketplace</h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
              Discover our exceptional collection of certified diamonds, available for both individual purchase and wholesale orders.
            </p>
            
            {/* New View Switcher */}
            <div className="inline-flex bg-white/10 backdrop-blur-sm rounded-xl p-1">
              <button
                onClick={() => setView('individual')}
                className={`flex items-center px-6 py-2.5 rounded-lg transition-all duration-200 ${
                  view === 'individual'
                    ? 'bg-white text-blue-600 shadow-lg scale-105'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Gem className={`w-5 h-5 mr-2 ${view === 'individual' ? 'text-blue-600' : 'text-white'}`} />
                <span className="font-medium">Individual Diamonds</span>
              </button>
              <button
                onClick={() => setView('wholesale')}
                className={`flex items-center px-6 py-2.5 rounded-lg transition-all duration-200 ${
                  view === 'wholesale'
                    ? 'bg-white text-blue-600 shadow-lg scale-105'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Package className={`w-5 h-5 mr-2 ${view === 'wholesale' ? 'text-blue-600' : 'text-white'}`} />
                <span className="font-medium">Wholesale Diamonds</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search diamonds..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Diamond Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {view === 'individual' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredIndividualDiamonds.map((diamond) => (
              <Link
                key={diamond.id}
                to={`/product/${diamond.id}`}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="relative">
                  <img
                    src={diamond.image_url || 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80'}
                    alt={diamond.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{diamond.cut}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{diamond.name}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">{diamond.description}</p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">${diamond.price.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{diamond.carat} carats</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-medium text-gray-900">{diamond.color} Color</span>
                      <span className="text-sm text-gray-500">{diamond.clarity} Clarity</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {filteredIndividualDiamonds.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                <Filter className="w-12 h-12 mb-4 text-gray-400" />
                <p className="text-lg font-medium">No diamonds found matching your search.</p>
                <p className="text-sm">Try adjusting your search terms.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredWholesaleDiamonds.map((diamond) => (
              <Link
                key={diamond.id}
                to={`/wholesale/${diamond.id}`}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="relative">
                  <img
                    src={diamond.image_url || 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80'}
                    alt={diamond.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <div className="flex items-center gap-1">
                      <Package className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium">{diamond.available_quantity} available</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{diamond.name}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">{diamond.description}</p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">
                        ${diamond.base_price_per_carat.toLocaleString()}/ct
                      </p>
                      <p className="text-sm text-gray-500">
                        {diamond.minimum_carat}-{diamond.maximum_carat} carats
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-medium text-green-600">
                        {diamond.bulk_discount_percentage}% bulk discount
                      </span>
                      <span className="text-sm text-gray-500">
                        Min. order: {diamond.minimum_order_quantity}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {filteredWholesaleDiamonds.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                <Filter className="w-12 h-12 mb-4 text-gray-400" />
                <p className="text-lg font-medium">No wholesale listings found matching your search.</p>
                <p className="text-sm">Try adjusting your search terms.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}