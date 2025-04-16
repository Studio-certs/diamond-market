import React from 'react';
import { Link } from 'react-router-dom';
import { Diamond, ArrowRight, Star, Shield, Award } from 'lucide-react';

export function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative pt-16 pb-20 lg:pt-24 lg:pb-28">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight">
                  <span className="block text-gray-900">Discover Rare</span>
                  <span className="block text-blue-600 mt-2">Premium Diamonds</span>
                </h1>
                <p className="mt-6 text-xl text-gray-500 max-w-lg mx-auto lg:mx-0">
                  Experience the brilliance of exceptional diamonds, carefully curated for both individual collectors and bulk buyers.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    to="/marketplace"
                    className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
                  >
                    <Diamond className="w-5 h-5 mr-2" />
                    Explore Collection
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/30 to-purple-500/30 rounded-2xl blur-3xl"></div>
                <img
                  className="relative rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500 object-cover w-full aspect-square"
                  src="https://images.unsplash.com/photo-1615655096345-61a54750068d?auto=format&fit=crop&q=80"
                  alt="Diamond showcase"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose DiamondMarket</h2>
            <p className="mt-4 text-lg text-gray-500">Experience the difference with our premium selection and expert service</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Star,
                title: 'Premium Quality',
                description: 'Every diamond in our collection is certified and meets the highest quality standards'
              },
              {
                icon: Shield,
                title: 'Secure Transactions',
                description: 'Your purchases are protected with state-of-the-art security measures'
              },
              {
                icon: Award,
                title: 'Expert Verification',
                description: 'Each diamond is verified by our team of certified gemologists'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="relative group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Start Your Diamond Journey?</h2>
            <Link
              to="/marketplace"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-base font-medium rounded-xl text-white hover:bg-white hover:text-blue-600 transition-all duration-200"
            >
              View Our Collection
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
