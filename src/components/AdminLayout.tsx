import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Gem, LayoutDashboard, Package } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();

  const navItems = [
    {
      name: 'Dashboard Overview',
      path: '/admin',
      icon: LayoutDashboard,
    },
    {
      name: 'User Management',
      path: '/admin/users',
      icon: Users,
    },
    {
      name: 'Individual Diamonds',
      path: '/admin/individual-diamonds',
      icon: Gem,
    },
    {
      name: 'Wholesale Diamonds',
      path: '/admin/wholesale-diamonds',
      icon: Package,
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
        </div>
        <nav className="mt-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-blue-600 bg-blue-50 border-r-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 overflow-auto">
        {children}
      </div>
    </div>
  );
}