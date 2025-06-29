import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { Package } from 'lucide-react';
import { ImageUpload } from '../../../components/ImageUpload';

export function AddWholesaleDiamond() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<{ url: string; isPrimary: boolean }[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const wholesaleData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      base_price_per_carat: parseFloat(formData.get('base_price_per_carat') as string),
      minimum_carat: parseFloat(formData.get('minimum_carat') as string),
      maximum_carat: parseFloat(formData.get('maximum_carat') as string),
      color: formData.get('color') as string,
      clarity: formData.get('clarity') as string,
      cut: formData.get('cut') as string,
      available_quantity: parseInt(formData.get('available_quantity') as string),
      minimum_order_quantity: parseInt(formData.get('minimum_order_quantity') as string),
      bulk_discount_percentage: parseFloat(formData.get('bulk_discount_percentage') as string),
    };

    try {
      const { data: diamond, error: insertError } = await supabase
        .from('wholesale_diamonds')
        .insert([wholesaleData])
        .select()
        .single();

      if (insertError) throw insertError;

      if (images.length > 0) {
        const { error: imagesError } = await supabase
          .from('diamond_images')
          .insert(
            images.map(img => ({
              wholesale_diamond_id: diamond.id,
              image_url: img.url,
              is_primary: img.isPrimary
            }))
          );
        
        if (imagesError) throw imagesError;
      }

      navigate('/admin/wholesale-diamonds');
    } catch (err) {
      console.error('Error adding wholesale listing:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while adding the wholesale listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Package className="h-6 w-6 mr-2 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Add Wholesale Diamond Listing</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <ImageUpload onImagesChange={setImages} />

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Listing Name</label>
          <input
            type="text"
            name="name"
            id="name"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            id="description"
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="base_price_per_carat" className="block text-sm font-medium text-gray-700">Base Price per Carat ($)</label>
            <input
              type="number"
              name="base_price_per_carat"
              id="base_price_per_carat"
              min="0"
              step="0.01"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="bulk_discount_percentage" className="block text-sm font-medium text-gray-700">Bulk Discount (%)</label>
            <input
              type="number"
              name="bulk_discount_percentage"
              id="bulk_discount_percentage"
              min="0"
              max="100"
              step="0.1"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="minimum_carat" className="block text-sm font-medium text-gray-700">Minimum Carat</label>
            <input
              type="number"
              name="minimum_carat"
              id="minimum_carat"
              min="0"
              step="0.01"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="maximum_carat" className="block text-sm font-medium text-gray-700">Maximum Carat</label>
            <input
              type="number"
              name="maximum_carat"
              id="maximum_carat"
              min="0"
              step="0.01"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="available_quantity" className="block text-sm font-medium text-gray-700">Available Quantity</label>
            <input
              type="number"
              name="available_quantity"
              id="available_quantity"
              min="1"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="minimum_order_quantity" className="block text-sm font-medium text-gray-700">Minimum Order Quantity</label>
            <input
              type="number"
              name="minimum_order_quantity"
              id="minimum_order_quantity"
              min="1"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color</label>
            <select
              name="color"
              id="color"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select color</option>
              {['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'].map((color) => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="clarity" className="block text-sm font-medium text-gray-700">Clarity</label>
            <select
              name="clarity"
              id="clarity"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select clarity</option>
              {['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2'].map((clarity) => (
                <option key={clarity} value={clarity}>{clarity}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="cut" className="block text-sm font-medium text-gray-700">Cut</label>
            <select
              name="cut"
              id="cut"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select cut</option>
              {['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'].map((cut) => (
                <option key={cut} value={cut}>{cut}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/admin/wholesale-diamonds')}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Wholesale Listing'}
          </button>
        </div>
      </form>
    </div>
  );
}
