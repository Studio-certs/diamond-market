import React from 'react';
    import { Link } from 'react-router-dom';
    import { Diamond, LogIn, UserCircle, ShoppingCart } from 'lucide-react'; // Added ShoppingCart for Marketplace
    import { useAuth } from '../hooks/useAuth';

    export function Navbar() {
      const { user, signOut } = useAuth();

      return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              {/* Left side - Logo */}
              <div className="flex items-center">
                <Link to="/" className="flex items-center flex-shrink-0">
                  <Diamond className="h-8 w-8 text-blue-600" />
                  <span className="ml-2 text-xl font-bold text-gray-900">DiamondMarket</span>
                </Link>
              </div>

              {/* Right side - Links & Auth */}
              <div className="flex items-center space-x-6">
                <Link
                  to="/marketplace"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors"
                >
                  <ShoppingCart className="h-5 w-5 mr-1" />
                  Marketplace
                </Link>

                {user ? (
                  <div className="flex items-center space-x-4">
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    {/* Removed welcome message span */}
                    <button
                      onClick={signOut}
                      className="text-gray-600 hover:text-gray-900 flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      <UserCircle className="h-5 w-5 mr-1" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-900 flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <LogIn className="h-5 w-5 mr-1" />
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>
      );
    }
