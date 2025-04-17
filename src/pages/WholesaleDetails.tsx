import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Package, Shield, AlignCenterVertical as Certificate, Sparkles, ArrowLeft, Users, Percent, Scale, Star } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

interface WholesaleDiamond {
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
}

interface DiamondImage {
  id: string;
  diamond_id: string;
  image_url: string;
  is_primary: boolean;
}

export function WholesaleDetails() {
  const { id } = useParams();
  const [diamond, setDiamond] = useState<WholesaleDiamond | null>(null);
  const [images, setImages] = useState<DiamondImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch diamond details
        const { data: diamondData, error: diamondError } = await supabase
          .from('wholesale_diamonds')
          .select('*')
          .eq('id', id)
          .single();

        if (diamondError) throw diamondError;
        setDiamond(diamondData);

        // Fetch diamond images
        const { data: imageData, error: imageError } = await supabase
          .from('wholesale_diamond_images')
          .select('*')
          .eq('diamond_id', id)
          .order('is_primary', { ascending: false });

        if (imageError) throw imageError;
        setImages(imageData || []);

        // Set initial selected image (primary image or first available)
        const primaryImage = imageData?.find(img => img.is_primary);
        setSelectedImage(primaryImage?.image_url || null);
      } catch (error) {
        console.error('Error fetching wholesale diamond:', error);
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
          <p className="text-gray-600">Loading wholesale details...</p>
        </div>
      </div>
    );
  }

  if (!diamond) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Wholesale listing not found</p>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go back
          </button>
        </div>
      </div>
    );
  }

  const defaultImage = 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80';
  const allImages = images.map(img => img.image_url);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Marketplace
        </button>

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
                      className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100 ${
                        selectedImage === img ? 'ring-2 ring-blue-500' : ''
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
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-6 w-6 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">Wholesale Listing</span>
                  </div>
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
                        {formatCurrency(diamond.base_price_per_carat)}
                      </span>
                      <span className="text-lg text-gray-500">per carat</span>
                    </div>
                    <p className="text-gray-500 mt-1">
                      {diamond.minimum_carat} - {diamond.maximum_carat} carats available
                    </p>
                  </div>

                  <div className="prose prose-sm text-gray-500 mb-8">
                    <p>{diamond.description}</p>
                  </div>

                  {/* Wholesale Specifications */}
                  <div className="border-t border-gray-200 pt-8 mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Wholesale Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Users className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Available Quantity</p>
                          <p className="text-sm text-gray-500">{diamond.available_quantity} pieces</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Scale className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Minimum Order</p>
                          <p className="text-sm text-gray-500">{diamond.minimum_order_quantity} pieces</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Percent className="w-5 h-5 text-purple-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Bulk Discount</p>
                          <p className="text-sm text-gray-500">{diamond.bulk_discount_percentage}% off</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Shield className="w-5 h-5 text-indigo-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Certification</p>
                          <p className="text-sm text-gray-500">GIA Certified</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Diamond Specifications */}
                  <div className="border-t border-gray-200 pt-8 mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Diamond Specifications</h3>
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
                          <p className="text-sm font-medium text-gray-900">Quality</p>
                          <p className="text-sm text-gray-500">IGI Certified</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="border-t border-gray-200 pt-8">
                    <div className="flex flex-col space-y-4">
                      <button className="w-full bg-blue-600 text-white px-8 py-4 rounded-xl font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                        Request Wholesale Information
                      </button>
                      <button className="w-full bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors">
                        Schedule Bulk Order Consultation
                      </button>
                    </div>
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