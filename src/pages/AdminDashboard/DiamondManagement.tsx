import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Diamond } from '../../types';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, Gem } from 'lucide-react';

export function DiamondManagement() {
  const [diamonds, setDiamonds] = useState<Diamond[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDiamonds();
  }, []);

  async function fetchDiamonds() {
    setLoading(true);
    setError(null);
    try {
      const { data, error: dbError } = await supabase
        .from('diamonds')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;
      setDiamonds(data || []);
    } catch (err) {
      setError(err instanceof Error ? `Failed to load diamonds: ${err.message}` : 'An unknown error occurred');
      console.error("Error fetching diamonds:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteDiamond(id: string) {
    if (!window.confirm('Are you sure you want to delete this diamond?')) {
      return;
    }
    try {
      const { error: deleteError } = await supabase
        .from('diamonds')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setDiamonds(diamonds.filter(diamond => diamond.id !== id));
    } catch (err) {
      setError(err instanceof Error ? `Failed to delete diamond: ${err.message}` : 'An unknown error occurred');
      console.error("Error deleting diamond:", err);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Gem className="h-6 w-6 mr-2 text-blue-600" />
          Diamond Management
        </h1>
        <button
          onClick={() => navigate('/admin/diamonds/add')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <PlusCircle size={18} />
          Add New Diamond
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {diamonds.map((diamond) => (
                  <tr key={diamond.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {diamond.image_url && (
                          <img
                            className="h-10 w-10 rounded-full mr-3 object-cover"
                            src={diamond.image_url}
                            alt={diamond.name}
                          />
                        )}
                        <div className="text-sm font-medium text-gray-900">{diamond.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        diamond.type === 'bulk' ? 'bg-yellow-100 text-yellow-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {diamond.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${diamond.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {diamond.carat}ct
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-3">
                        <button
                          onClick={() => navigate(`/admin/diamonds/edit/${diamond.id}`)}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors"
                          aria-label={`Edit ${diamond.name}`}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteDiamond(diamond.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          aria-label={`Delete ${diamond.name}`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {diamonds.length === 0 && (
              <div className="text-center py-4 text-gray-500">No diamonds found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}