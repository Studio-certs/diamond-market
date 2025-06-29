import React from 'react';
import { Users, Gem, TrendingUp, AlertCircle } from 'lucide-react';

export function Overview() {
  const stats = [
    {
      name: 'Total Users',
      value: '2,345',
      change: '+12%',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      name: 'Active Diamonds',
      value: '456',
      change: '+23%',
      icon: Gem,
      color: 'bg-purple-500',
    },
    {
      name: 'Total Sales',
      value: '$123,456',
      change: '+8%',
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      name: 'Pending Orders',
      value: '12',
      change: '-2%',
      icon: AlertCircle,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    <p className={`ml-2 text-sm font-medium ${
                      stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="ml-3 text-sm text-gray-600">New user registration</p>
                <span className="ml-auto text-sm text-gray-400">2 hours ago</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="ml-3 text-sm text-gray-600">All systems operational</p>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="ml-3 text-sm text-gray-600">Database status: Healthy</p>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="ml-3 text-sm text-gray-600">API status: 100% uptime</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
