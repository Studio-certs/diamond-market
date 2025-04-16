import React from 'react';
import { Link } from 'react-router-dom';
import { Diamond, LogIn, UserCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Diamond className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold">DiamondMarket</span>
            </Link>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/marketplace" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md">
                Marketplace
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-gray-600 hover:text-gray-900">
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={signOut}
                  className="text-gray-600 hover:text-gray-900 flex items-center"
                >
                  <UserCircle className="h-5 w-5 mr-1" />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 flex items-center"
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