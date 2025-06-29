import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Star, Shield, Gem as Certificate, Sparkles, ArrowLeft } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import type { IndividualDiamond, DiamondImage } from '../types';

interface DiamondDetails extends IndividualDiamond {
  diamond_images: DiamondImage[];
}

export function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [diamond, setDiamond] = useState<DiamondDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!id) {
        setError("No product ID provided.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const { data, error: rpcError } = await supabase
          .rpc('get_individual_diamond_by_id', { p_id: id })
          .single();

        if (rpcError) throw rpcError;
        if (!data) throw new Error("Product not found.");

        setDiamond(data);
        // Set initial selected image (primary image or first available)
        const primaryImage = data.diamond_images?.find(img => img.is_primary);
        setSelectedImage(primaryImage?.image_url || data.diamond_images?.[0]?.image_url || null);

      } catch (err) {
        console.error('Error fetching diamond:', err);
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !diamond) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">{error || "Product not found"}</p>
          <Link
            to="/marketplace"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const allImages = diamond.diamond_images.map(img => img.image_url);
  const defaultImage = 'https://images.pexels.com/photos/1395306/pexels-photo-1395306.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/marketplace"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Marketplace
        </Link>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Images */}
            <div className="p-6 lg:p-8">
              <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={selectedImage || defaultImage}
                  alt={diamond.name}
                  className="w-full h-full object-center object-cover"
                />
              </div>
              {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(img)}
                      className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100 transition-all ${
                        selectedImage === img ? 'ring-2 ring-blue-500' : 'hover:opacity-80'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`View ${index + 1}`}
                        className="w-full h-full object-center object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Details */}
            <div className="p-6 lg:p-8">
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{diamond.name}</h1>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {diamond.cut} Cut
                    </div>
                    <div className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                      {diamond.clarity} Clarity
                    </div>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-gray-900">
                        {formatCurrency(diamond.price)}
                      </span>
                      <span className="text-lg text-gray-500">AUD</span>
                    </div>
                    <p className="text-gray-500 mt-1">{diamond.carat} carats</p>
                  </div>

                  <div className="prose prose-sm text-gray-500 mb-8">
                    <p>{diamond.description}</p>
                  </div>

                  {/* Specifications */}
                  <div className="border-t border-gray-200 pt-8 mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Specifications</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Cut</p>
                          <p className="text-sm text-gray-500">{diamond.cut}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Sparkles className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Color</p>
                          <p className="text-sm text-gray-500">{diamond.color}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Certificate className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Clarity</p>
                          <p className="text-sm text-gray-500">{diamond.clarity}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Shield className="w-5 h-5 text-purple-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Certification</p>
                          <p className="text-sm text-gray-500">GIA Certified</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t border-gray-200 pt-8 mt-8">
                  <div className="flex flex-col space-y-4">
                    <button className="w-full bg-blue-600 text-white px-8 py-4 rounded-xl font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                      Request Purchase Information
                    </button>
                    <button className="w-full bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors">
                      Schedule Viewing
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
