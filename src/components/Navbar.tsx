import React from 'react';
import { Link } from 'react-router-dom';
import { Bike } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-[#0B60B0] text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Bike size={28} className="text-[#FF7C1F]" />
          <span className="text-xl font-bold">RateYourBike</span>
        </Link>
        <div className="flex space-x-4 items-center">
          <Link 
            to="/" 
            className="hover:text-[#FF7C1F] transition-colors duration-200"
          >
            Home
          </Link>
          <Link 
            to="/review/new" 
            className="bg-[#FF7C1F] hover:bg-[#E86C10] px-4 py-2 rounded-md font-medium transition-colors duration-200"
          >
            Rate a Bike
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;