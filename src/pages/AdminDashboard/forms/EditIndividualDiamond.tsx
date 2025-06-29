import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { Gem } from 'lucide-react';
import { ImageUpload } from '../../../components/ImageUpload';
import type { IndividualDiamond } from '../../../types';

interface DiamondWithImages extends IndividualDiamond {
  diamond_images?: {
    image_url: string;
    is_primary: boolean;
  }[];
}

export function EditIndividualDiamond() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [diamond, setDiamond] = useState<DiamondWithImages | null>(null);
  const [images, setImages] = useState<{ url: string; isPrimary: boolean }[]>([]);

  useEffect(() => {
    async function fetchDiamond() {
      if (!id) return;
      try {
        // Use the new RPC function to fetch a single diamond with its images
        const { data: diamondData, error: rpcError } = await supabase
          .rpc('get_individual_diamond_by_id', { p_id: id })
          .single();

        if (rpcError) throw rpcError;
        setDiamond(diamondData);

        // Transform image data to the format expected by ImageUpload component
        if (diamondData?.diamond_images) {
          const transformedImages = (diamondData.diamond_images as any[]).map(img => ({
            url: img.image_url,
            isPrimary: img.is_primary
          }));
          setImages(transformedImages);
        }
      } catch (err) {
        console.error('Error fetching diamond:', err);
        setError('Failed to load diamond details');
      }
    }

    fetchDiamond();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const updatedData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      carat: parseFloat(formData.get('carat') as string),
      color: formData.get('color') as string,
      clarity: formData.get('clarity') as string,
      cut: formData.get('cut') as string,
    };

    try {
      // Update diamond details
      const { error: updateError } = await supabase
        .from('individual_diamonds')
        .update(updatedData)
        .eq('id', id);

      if (updateError) throw updateError;

      // Delete existing images using the correct foreign key column
      const { error: deleteError } = await supabase
        .from('diamond_images')
        .delete()
        .eq('individual_diamond_id', id);

      if (deleteError) throw deleteError;

      // Insert new images using the correct foreign key column
      if (images.length > 0) {
        const { error: imagesError } = await supabase
          .from('diamond_images')
          .insert(
            images.map(img => ({
              individual_diamond_id: id,
              image_url: img.url,
              is_primary: img.isPrimary
            }))
          );

        if (imagesError) throw imagesError;
      }

      navigate('/admin/individual-diamonds');
    } catch (err) {
      console.error('Error updating diamond:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while updating the diamond');
    } finally {
      setLoading(false);
    }
  };

  if (!diamond) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Gem className="h-6 w-6 mr-2 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Edit Individual Diamond</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <ImageUpload 
          onImagesChange={setImages} 
          existingImages={images}
        />

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            required
            defaultValue={diamond.name}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            id="description"
            rows={3}
            defaultValue={diamond.description || ''}
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
              defaultValue={diamond.price}
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
              defaultValue={diamond.carat}
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
              defaultValue={diamond.color}
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
              defaultValue={diamond.clarity}
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
              defaultValue={diamond.cut}
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
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
