import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl">FOODECONOMY</span>
            </Link>
          </div>
          <div className="flex items-center">
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500">
                Dashboard
              </Link>
              <Link to="/products" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500">
                Productos
              </Link>
              <Link to="/recommendations" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500">
                Recomendaciones
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;