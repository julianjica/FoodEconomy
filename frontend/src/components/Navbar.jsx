import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Efecto para detectar scroll y cambiar la apariencia de la navbar
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Función para determinar si un enlace está activo
  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed w-full z-10 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md' : 'bg-gradient-to-r from-blue-900 to-indigo-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo y nombre */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center space-x-2">
              <div className={`rounded-md p-1 ${scrolled ? 'bg-blue-100' : 'bg-white/10'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${scrolled ? 'text-blue-700' : 'text-blue-100'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className={`font-bold text-xl tracking-tight ${scrolled ? 'text-blue-900' : 'text-white'}`}>
                  PriceTrack
                </span>
                <span className={`text-xs ${scrolled ? 'text-blue-600' : 'text-blue-100'}`}>
                  Análisis de Mercado
                </span>
              </div>
            </Link>
          </div>
          
          {/* Navigation - Desktop */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <div className="flex space-x-1">
              <Link 
                to="/dashboard" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive('/dashboard') 
                    ? scrolled 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-white/10 text-white' 
                    : scrolled 
                      ? 'text-blue-700 hover:bg-blue-50' 
                      : 'text-blue-100 hover:bg-white/10'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                to="/products" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive('/products') 
                    ? scrolled 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-white/10 text-white' 
                    : scrolled 
                      ? 'text-blue-700 hover:bg-blue-50' 
                      : 'text-blue-100 hover:bg-white/10'
                }`}
              >
                Productos
              </Link>
              <Link 
                to="/recommendations" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive('/recommendations') 
                    ? scrolled 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-white/10 text-white' 
                    : scrolled 
                      ? 'text-blue-700 hover:bg-blue-50' 
                      : 'text-blue-100 hover:bg-white/10'
                }`}
              >
                Recomendaciones
              </Link>
            </div>
            <div className="ml-4 border-l border-blue-200/30 pl-4">
              <button 
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  scrolled
                    ? 'bg-blue-700 text-white hover:bg-blue-800' 
                    : 'bg-white text-blue-800 hover:bg-blue-50'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Lista de Compras
              </button>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                scrolled
                  ? 'text-blue-700 hover:text-blue-900 hover:bg-blue-100'
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              } focus:outline-none`}
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
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden ${scrolled ? 'bg-white' : 'bg-blue-900/95'} shadow-lg`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link 
            to="/dashboard" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/dashboard') 
                ? scrolled 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-white/10 text-white' 
                : scrolled 
                  ? 'text-blue-700 hover:bg-blue-50' 
                  : 'text-blue-100 hover:bg-white/10'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link 
            to="/products" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/products') 
                ? scrolled 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-white/10 text-white' 
                : scrolled 
                  ? 'text-blue-700 hover:bg-blue-50' 
                  : 'text-blue-100 hover:bg-white/10'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Productos
          </Link>
          <Link 
            to="/recommendations" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/recommendations') 
                ? scrolled 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-white/10 text-white' 
                : scrolled 
                  ? 'text-blue-700 hover:bg-blue-50' 
                  : 'text-blue-100 hover:bg-white/10'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Recomendaciones
          </Link>
          <button 
            className={`w-full flex items-center px-3 py-2 text-base font-medium rounded-md ${
              scrolled
                ? 'bg-blue-700 text-white hover:bg-blue-800' 
                : 'bg-white text-blue-800 hover:bg-blue-50'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Lista de Compras
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;