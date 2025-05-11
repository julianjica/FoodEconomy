import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, fetchCities } from '../utils/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('all'); // 'all', 'lowToHigh', 'highToLow'
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Datos de ejemplo para categorías (en una app real, podrías obtenerlos de la API)
  const categories = [
    { id: 'fruits', name: 'Frutas' },
    { id: 'vegetables', name: 'Verduras' },
    { id: 'grains', name: 'Granos' },
    { id: 'dairy', name: 'Lácteos' },
    { id: 'meat', name: 'Carnes' },
  ];

  // Datos de ejemplo para precios y tendencias (en una app real, vendrían de la API)
  const productDetails = {
    10: { price: 2500, trend: 'up', category: 'vegetables' },
    12: { price: 5200, trend: 'down', category: 'fruits' },
    30: { price: 1800, trend: 'stable', category: 'vegetables' },
    13: { price: 2100, trend: 'up', category: 'fruits' },
    18: { price: 3500, trend: 'down', category: 'fruits' },
    3: { price: 1500, trend: 'stable', category: 'vegetables' }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Cargar productos y ciudades
        const productsData = await fetchProducts();
        const citiesData = await fetchCities();
        
        setProducts(productsData);
        setCities(citiesData);
        
        // Establecer ciudad predeterminada
        if (citiesData.length > 0) {
          setSelectedCity(citiesData[0]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  // Filtrar productos por búsqueda y categoría
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || 
                           (productDetails[product.id] && productDetails[product.id].category === categoryFilter);
    return matchesSearch && matchesCategory;
  });

  // Ordenar productos según el filtro de precio
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (priceFilter === 'lowToHigh') {
      return (productDetails[a.id]?.price || 0) - (productDetails[b.id]?.price || 0);
    } else if (priceFilter === 'highToLow') {
      return (productDetails[b.id]?.price || 0) - (productDetails[a.id]?.price || 0);
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 pt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-3 text-lg text-gray-700">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Catálogo de Productos</h1>
          <p className="text-gray-600">Explora todos los productos disponibles y sus precios actualizados</p>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white shadow-card rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Buscar producto</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Buscar por nombre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Selección de ciudad */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
              <select
                id="city"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Filtro por categoría */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                id="category"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="inline-flex items-center">
              <label htmlFor="price-filter" className="mr-2 text-sm font-medium text-gray-700">Ordenar por:</label>
              <select
                id="price-filter"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
              >
                <option value="all">Relevancia</option>
                <option value="lowToHigh">Precio: menor a mayor</option>
                <option value="highToLow">Precio: mayor a menor</option>
              </select>
            </div>
            <div className="text-sm text-gray-500">
              {sortedProducts.length} productos encontrados
            </div>
          </div>
        </div>

        {/* Lista de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {sortedProducts.map(product => {
            const details = productDetails[product.id] || { price: 0, trend: 'stable', category: 'other' };
            return (
              <Link to={`/product/${product.id}`} key={product.id} className="block">
                <div className="bg-white shadow-card hover:shadow-lg rounded-xl overflow-hidden transition-shadow duration-300">
                  <div className="p-1 bg-gray-200">
                    <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        details.trend === 'up' 
                          ? 'bg-red-100 text-red-800' 
                          : details.trend === 'down' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {details.trend === 'up' 
                          ? '↑ Subiendo' 
                          : details.trend === 'down' 
                            ? '↓ Bajando' 
                            : '→ Estable'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {categories.find(c => c.id === details.category)?.name || 'Otra categoría'}
                    </p>
                    <div className="mt-3 flex justify-between items-end">
                      <div>
                        <p className="text-xs text-gray-500">Precio actual</p>
                        <p className="text-xl font-bold text-gray-900">${details.price.toLocaleString()}</p>
                      </div>
                      <button className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Si no hay resultados */}
        {sortedProducts.length === 0 && (
          <div className="bg-white shadow-card rounded-xl p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No se encontraron productos</h3>
            <p className="text-gray-500">Intenta ajustar tus filtros o busca con otros términos</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
                setPriceFilter('all');
              }}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        )}

        {/* Estadísticas y sugerencias */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4">
            <div className="flex-shrink-0 bg-blue-100 rounded-full p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-blue-800 mb-1">¿Por qué los precios varían?</h3>
              <p className="text-blue-600">
                Los precios de los productos alimenticios pueden cambiar debido a factores como estacionalidad, clima, 
                costos de transporte y condiciones de mercado.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-medium text-gray-900 mb-2">Productos con mayores bajadas de precio</h4>
              <ul className="space-y-3">
                <li className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Aguacate</span>
                  <span className="text-sm font-medium text-green-600">-15.4%</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Limón Tahití</span>
                  <span className="text-sm font-medium text-green-600">-10.2%</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Banano</span>
                  <span className="text-sm font-medium text-green-600">-5.8%</span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-medium text-gray-900 mb-2">Productos con tendencia al alza</h4>
              <ul className="space-y-3">
                <li className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tomate</span>
                  <span className="text-sm font-medium text-red-600">+22.7%</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Papa criolla</span>
                  <span className="text-sm font-medium text-red-600">+12.3%</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Cebolla cabezona blanca</span>
                  <span className="text-sm font-medium text-red-600">+8.6%</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Paginación */}
        <div className="mt-8 flex justify-center">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <a
              href="#"
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Previous</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </a>
            <a
              href="#"
              aria-current="page"
              className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
            >
              1
            </a>
            <a
              href="#"
              className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
            >
              2
            </a>
            <a
              href="#"
              className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hidden md:inline-flex relative items-center px-4 py-2 border text-sm font-medium"
            >
              3
            </a>
            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
              ...
            </span>
            <a
              href="#"
              className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hidden md:inline-flex relative items-center px-4 py-2 border text-sm font-medium"
            >
              8
            </a>
            <a
              href="#"
              className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
            >
              9
            </a>
            <a
              href="#"
              className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
            >
              10
            </a>
            <a
              href="#"
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Next</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Products;