import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Función para determinar si un enlace está activo
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-indigo-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo y nombre */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="bg-white p-1 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="ml-3 font-bold text-xl text-white tracking-tight">FOODECONOMY</span>
            </Link>
          </div>
          
          {/* Navigation - Desktop */}
          <div className="hidden md:ml-6 md:flex md:items-center">
            <div className="flex space-x-1">
              <Link 
                to="/" 
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200
                  ${isActive('/') 
                    ? 'bg-indigo-900 text-white' 
                    : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/products" 
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200
                  ${isActive('/products') 
                    ? 'bg-indigo-900 text-white' 
                    : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'}`}
              >
                Productos
              </Link>
              <Link 
                to="/recommendations" 
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200
                  ${isActive('/recommendations') 
                    ? 'bg-indigo-900 text-white' 
                    : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'}`}
              >
                Recomendaciones
              </Link>
            </div>
            <div className="ml-6 flex items-center">
              <button className="flex items-center bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Contacto
              </button>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-indigo-100 hover:text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Abrir menú principal</span>
              {/* Icon when menu is closed */}
              <svg 
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Icon when menu is open */}
              <svg 
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link 
            to="/" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/') ? 'bg-indigo-900 text-white' : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link 
            to="/products" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/products') ? 'bg-indigo-900 text-white' : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Productos
          </Link>
          <Link 
            to="/recommendations" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/recommendations') ? 'bg-indigo-900 text-white' : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Recomendaciones
          </Link>
          <button 
            className="w-full flex items-center px-3 py-2 text-base font-medium text-indigo-100 hover:bg-indigo-700 hover:text-white rounded-md"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            Contacto
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;