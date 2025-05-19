import React from 'react';
import { Link } from 'react-router-dom';
import { Bike, AlertTriangle } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full text-center">
        <div className="relative mb-6">
          <Bike size={80} className="text-[#0B60B0] mx-auto" />
          <div className="absolute top-0 right-1/3">
            <AlertTriangle size={32} className="text-[#FF7C1F]" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        
        <p className="text-gray-600 mb-8">
          Looks like you've taken a wrong turn on your ride. The page you're looking for doesn't exist.
        </p>
        
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-[#0B60B0] text-white font-medium rounded-md hover:bg-[#094E90] transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;