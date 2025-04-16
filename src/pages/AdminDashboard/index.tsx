import React, { useState, useEffect } from 'react';
    import { supabase } from '../../lib/supabase';
    import { Diamond, User as UserType } from '../../types'; // Renamed User to UserType to avoid conflict
    import { useNavigate } from 'react-router-dom';
    import { PlusCircle, Edit, Trash2, Users, Gem } from 'lucide-react';

    export function AdminDashboard() {
      const [diamonds, setDiamonds] = useState<Diamond[]>([]);
      const [users, setUsers] = useState<UserType[]>([]);
      const [loadingDiamonds, setLoadingDiamonds] = useState(true);
      const [loadingUsers, setLoadingUsers] = useState(true);
      const [error, setError] = useState<string | null>(null);
      const navigate = useNavigate();

      useEffect(() => {
        fetchDiamonds();
        fetchUsers();
      }, []);

      async function fetchDiamonds() {
        setLoadingDiamonds(true);
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
          setLoadingDiamonds(false);
        }
      }

      async function fetchUsers() {
        setLoadingUsers(true);
        setError(null);
        try {
          // Ensure you have appropriate RLS policies for admins to read profiles
          const { data, error: dbError } = await supabase
            .from('profiles')
            .select('id, full_name, email, role, created_at') // Explicitly select columns
            .order('created_at', { ascending: false });

          if (dbError) throw dbError;
          // Map data to UserType, handling potential nulls if needed
          const fetchedUsers: UserType[] = (data || []).map(profile => ({
            id: profile.id,
            email: profile.email || 'N/A', // Provide default if email can be null
            role: profile.role || 'user', // Provide default if role can be null
            full_name: profile.full_name || 'N/A', // Provide default if full_name can be null
          }));
          setUsers(fetchedUsers);
        } catch (err) {
          setError(err instanceof Error ? `Failed to load users: ${err.message}` : 'An unknown error occurred');
          console.error("Error fetching users:", err);
        } finally {
          setLoadingUsers(false);
        }
      }


      async function handleDeleteDiamond(id: string) {
        // Add confirmation dialog before deleting
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

      const isLoading = loadingDiamonds || loadingUsers;

      return (
        <div className="container mx-auto px-4 py-8 space-y-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">Admin Dashboard</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {/* User Management (CRM) Section */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <Users className="mr-2 h-6 w-6 text-indigo-600" />
              User Management (CRM)
            </h2>
            {loadingUsers ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.full_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{user.id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && <p className="text-center py-4 text-gray-500">No users found.</p>}
              </div>
            )}
          </section>

          {/* Diamond Management Section */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                <Gem className="mr-2 h-6 w-6 text-blue-600" />
                Diamond Management
              </h2>
              <button
                onClick={() => navigate('/admin/add')} // Assuming you'll create this route later
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <PlusCircle size={18} />
                Add New Diamond
              </button>
            </div>
            {loadingDiamonds ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
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
                      <tr key={diamond.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {diamond.image_url && (
                              <img
                                className="h-10 w-10 rounded-full mr-3 object-cover flex-shrink-0"
                                src={diamond.image_url}
                                alt={diamond.name}
                              />
                            )}
                            <div className="text-sm font-medium text-gray-900 truncate">{diamond.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${diamond.type === 'bulk' ? 'bg-yellow-100 text-yellow-800' : 'bg-purple-100 text-purple-800'}`}>
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
                              onClick={() => navigate(`/admin/edit/${diamond.id}`)} // Assuming you'll create this route later
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
                {diamonds.length === 0 && <p className="text-center py-4 text-gray-500">No diamonds found.</p>}
              </div>
            )}
          </section>
        </div>
      );
    }
