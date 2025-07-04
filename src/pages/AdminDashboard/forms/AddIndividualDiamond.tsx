import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { Gem } from 'lucide-react';
import { ImageUpload } from '../../../components/ImageUpload';

export function AddIndividualDiamond() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<{ url: string; isPrimary: boolean }[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const params = {
      p_name: formData.get('name') as string,
      p_description: formData.get('description') as string,
      p_price: parseFloat(formData.get('price') as string),
      p_carat: parseFloat(formData.get('carat') as string),
      p_color: formData.get('color') as string,
      p_clarity: formData.get('clarity') as string,
      p_cut: formData.get('cut') as string,
      p_images: images,
    };

    try {
      // Call the new RPC function to handle the entire operation
      const { error: rpcError } = await supabase.rpc(
        'add_individual_diamond_with_images',
        params
      );

      if (rpcError) {
        throw rpcError;
      }

      navigate('/admin/individual-diamonds');
    } catch (err) {
      console.error('Error adding diamond via RPC:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      // Provide a more user-friendly error message
      if (errorMessage.includes('Permission denied')) {
        setError('You do not have permission to add a diamond. Please contact an administrator.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Gem className="h-6 w-6 mr-2 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Add Individual Diamond</h1>
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
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
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
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label>
            <input
              type="number"
              name="price"
              id="price"
              min="0"
              step="0.01"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="carat" className="block text-sm font-medium text-gray-700">Carat</label>
            <input
              type="number"
              name="carat"
              id="carat"
              min="0"
              step="0.01"
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
            onClick={() => navigate('/admin/individual-diamonds')}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Diamond'}
          </button>
        </div>
      </form>
    </div>
  );
}
