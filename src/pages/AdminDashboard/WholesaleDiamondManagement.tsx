import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { WholesaleDiamond } from '../../types';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, Package } from 'lucide-react';
import { DeleteConfirmationModal } from '../../components/DeleteConfirmationModal';

interface WholesaleDiamondWithImage extends WholesaleDiamond {
  wholesale_diamond_images?: {
    image_url: string;
    is_primary: boolean;
  }[];
}

export function WholesaleDiamondManagement() {
  const [diamonds, setDiamonds] = useState<WholesaleDiamondWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [diamondToDelete, setDiamondToDelete] = useState<WholesaleDiamondWithImage | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDiamonds();
  }, []);

  async function fetchDiamonds() {
    setLoading(true);
    setError(null);
    try {
      const { data, error: dbError } = await supabase
        .from('wholesale_diamonds')
        .select(`
          *,
          wholesale_diamond_images (
            image_url,
            is_primary
          )
        `)
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;
      setDiamonds(data || []);
    } catch (err) {
      setError(err instanceof Error ? `Failed to load wholesale diamonds: ${err.message}` : 'An unknown error occurred');
      console.error("Error fetching wholesale diamonds:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteClick = (diamond: WholesaleDiamondWithImage) => {
    setDiamondToDelete(diamond);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!diamondToDelete) return;

    try {
      const { error: deleteError } = await supabase
        .from('wholesale_diamonds')
        .delete()
        .eq('id', diamondToDelete.id);

      if (deleteError) throw deleteError;
      setDiamonds(diamonds.filter(diamond => diamond.id !== diamondToDelete.id));
      setDeleteModalOpen(false);
      setDiamondToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? `Failed to delete wholesale listing: ${err.message}` : 'An unknown error occurred');
      console.error("Error deleting wholesale listing:", err);
    }
  };

  const defaultImage = 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Package className="h-6 w-6 mr-2 text-blue-600" />
          Wholesale Diamond Management
        </h1>
        <button
          onClick={() => navigate('/admin/wholesale-diamonds/add')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <PlusCircle size={18} />
          Add New Wholesale Listing
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Price/Carat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carat Range</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available Qty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {diamonds.map((diamond) => {
                  const primaryImage = diamond.wholesale_diamond_images?.find(img => img.is_primary);
                  return (
                    <tr key={diamond.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="h-10 w-10 rounded-full mr-3 object-cover"
                            src={primaryImage?.image_url || defaultImage}
                            alt={diamond.name}
                          />
                          <div className="text-sm font-medium text-gray-900">{diamond.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${diamond.base_price_per_carat.toLocaleString()}/ct
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {diamond.minimum_carat}ct - {diamond.maximum_carat}ct
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {diamond.available_quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {diamond.bulk_discount_percentage}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-3">
                          <button
                            onClick={() => navigate(`/admin/wholesale-diamonds/edit/${diamond.id}`)}
                            className="text-indigo-600 hover:text-indigo-900 transition-colors"
                            aria-label={`Edit ${diamond.name}`}
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(diamond)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            aria-label={`Delete ${diamond.name}`}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {diamonds.length === 0 && (
              <div className="text-center py-4 text-gray-500">No wholesale listings found.</div>
            )}
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDiamondToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemName={diamondToDelete?.name || ''}
      />
    </div>
  );
}