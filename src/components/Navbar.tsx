import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import icon from '../assets/icon.png';
import logo from '../assets/logo.png';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-[#0B60B0] text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
          <Link to="/" className="flex items-center space-x-4">
            {/* Icon - hidden on mobile, visible on small screens and up */}
            <img
              src={icon}
              alt="App Icon"
              className="hidden sm:block h-16 sm:h-20"
            />

            {/* Logo - always visible */}
            <img
              src={logo}
              alt="RateYourBike Logo"
              className="h-16 sm:h-20"
            />
          </Link>


        {/* Nav Buttons */}
        <div className="flex space-x-4 items-center">
          {/* Home button for desktop */}
          <Link 
            to="/" 
            className="hidden sm:inline hover:text-[#FF7C1F] transition-colors duration-200"
          >
            Home
          </Link>

          {/* Home icon for mobile */}
          <Link 
            to="/" 
            className="inline sm:hidden hover:text-[#FF7C1F] transition-colors duration-200"
          >
            <Home size={22} />
          </Link>

          {/* Rate a Bike Button */}
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
