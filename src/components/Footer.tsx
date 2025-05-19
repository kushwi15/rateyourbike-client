import React from 'react';
import { Mail, Github, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B60B0] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">RateYourBike</h3>
            <p className="text-sm text-gray-200">
              An open-access platform for bike enthusiasts to share their experiences
              and help others make informed decisions.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-[#FF7C1F] transition-colors duration-200">
                  Home
                </a>
              </li>
              <li>
                <a href="/review/new" className="hover:text-[#FF7C1F] transition-colors duration-200">
                  Rate a Bike
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4 text-white">
              <a href="#" className="hover:text-[#FF7C1F] transition-colors duration-200">
                <Mail size={20} />
              </a>
              <a href="#" className="hover:text-[#FF7C1F] transition-colors duration-200">
                <Github size={20} />
              </a>
              <a href="#" className="hover:text-[#FF7C1F] transition-colors duration-200">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-sm text-gray-300">
  <p>&copy; {new Date().getFullYear()} RateYourBike. All rights reserved.</p>

  <div className="mt-2 flex items-center justify-center space-x-2">
    <span>Designed and Developed By</span>
    <a
      href="https://github.com/kushwi15"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center space-x-2 hover:underline"
    >
      <img
        src="https://kushwi15.github.io/svsdetailing/img/kushwi-logo.jpg"
        alt="Kushwi Logo"
        className="w-6 h-6 rounded-full"
      />
      <span className="text-white font-semibold">Kushwi</span>
    </a>
  </div>
</div>

        
      </div>
    </footer>
  );
};

export default Footer;