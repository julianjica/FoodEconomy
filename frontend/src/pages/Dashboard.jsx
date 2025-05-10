import React, { useState, useEffect } from 'react';
import PriceLineChart from '../components/charts/PriceLineChart';
import InflationBarChart from '../components/charts/InflationBarChart';
import { fetchPriceData, fetchProducts, fetchCities, fetchRecommendations } from '../utils/api';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [priceData, setPriceData] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('year'); // 'year', 'month', 'week'

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Cargar productos y ciudades
        const productsData = await fetchProducts();
        const citiesData = await fetchCities();
        
        setProducts(productsData);
        setCities(citiesData);
        
        // Establecer selecciones iniciales
        setSelectedProduct(productsData[0]);
        setSelectedCity(citiesData[0]);
        
        // Cargar recomendaciones
        const recommendationsData = await fetchRecommendations();
        setRecommendations(recommendationsData);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading initial data:', error);
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  useEffect(() => {
    // Cargar datos de precios cuando cambia el producto o la ciudad seleccionada
    if (selectedProduct && selectedCity) {
      setLoading(true);
      fetchPriceData(selectedProduct.id, selectedCity)
        .then(data => {
          setPriceData(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching price data:', error);
          setLoading(false);
        });
    }
  }, [selectedProduct, selectedCity]);

  // Manejadores para cambios en selecciones
  const handleProductChange = (e) => {
    const productId = parseInt(e.target.value);
    const product = products.find(p => p.id === productId);
    setSelectedProduct(product);
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  // Calcular variaciones
  const calculatePriceVariation = () => {
    if (priceData.length < 2) return { value: 'N/A', isPositive: false };
    
    const lastPrice = priceData[priceData.length - 1]?.price || 0;
    const firstPrice = priceData[0]?.price || 0;
    
    if (firstPrice === 0) return { value: 'N/A', isPositive: false };
    
    const variation = ((lastPrice / firstPrice - 1) * 100).toFixed(1);
    return { 
      value: `${variation}%`, 
      isPositive: parseFloat(variation) >= 0 
    };
  };

  const priceVariation = calculatePriceVariation();

  // Determinar tendencia
  const determineTrend = () => {
    if (priceData.length < 3) return { trend: 'N/A', isPositive: false, icon: null };
    
    const lastPrice = priceData[priceData.length - 1]?.price || 0;
    const previousPrice = priceData[priceData.length - 2]?.price || 0;
    
    if (lastPrice > previousPrice) {
      return { 
        trend: 'Al alza', 
        isPositive: false,
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        )
      };
    } else if (lastPrice < previousPrice) {
      return { 
        trend: 'A la baja', 
        isPositive: true,
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
          </svg>
        )
      };
    } else {
      return { 
        trend: 'Estable', 
        isPositive: null,
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
          </svg>
        )
      };
    }
  };

  const trendInfo = determineTrend();

  // Determinar recomendación basada en la tendencia
  const getRecommendation = () => {
    if (trendInfo.trend === 'A la baja') {
      return { text: 'Buen momento para comprar', color: 'text-green-600' };
    } else if (trendInfo.trend === 'Al alza') {
      return { text: 'Considere esperar', color: 'text-red-600' };
    } else {
      return { text: 'Precio estable', color: 'text-yellow-600' };
    }
  };

  const recommendation = getRecommendation();

  if (loading && (!products.length || !cities.length)) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 mx-auto text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-3 text-lg text-gray-700">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 bg-gray-50">
      {/* Título y descripción */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Precios</h1>
          <p className="mt-2 text-lg text-gray-600">Monitoreo de precios y tendencias de alimentos en Colombia</p>
        </div>
        
        {/* Filtros y selección */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Filtros de búsqueda</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
                <div className="relative">
                  <select
                    id="product"
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={selectedProduct?.id || ''}
                    onChange={handleProductChange}
                  >
                    {products.map(product => (
                      <option key={product.id} value={product.id}>{product.name}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                <div className="relative">
                  <select
                    id="city"
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={selectedCity}
                    onChange={handleCityChange}
                  >
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rango de tiempo</label>
                <div className="flex rounded-md shadow-sm">
                  <button
                    type="button"
                    className={`relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium 
                      ${timeRange === 'week' ? 'text-indigo-700 bg-indigo-50 z-10' : 'text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => handleTimeRangeChange('week')}
                  >
                    Semana
                  </button>
                  <button
                    type="button"
                    className={`relative -ml-px inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium 
                      ${timeRange === 'month' ? 'text-indigo-700 bg-indigo-50 z-10' : 'text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => handleTimeRangeChange('month')}
                  >
                    Mes
                  </button>
                  <button
                    type="button"
                    className={`relative -ml-px inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium 
                      ${timeRange === 'year' ? 'text-indigo-700 bg-indigo-50 z-10' : 'text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => handleTimeRangeChange('year')}
                  >
                    Año
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Estadísticas rápidas */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Precio actual */}
          <div className="bg-white overflow-hidden shadow-md rounded-xl transition-all duration-300 hover:shadow-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-md p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Precio actual</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        ${priceData.length ? priceData[priceData.length - 1].price.toLocaleString() : 'N/A'}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${priceVariation.isPositive ? 'text-red-600' : 'text-green-600'}`}>
                        {priceVariation.value !== 'N/A' && (
                          <span>{priceVariation.isPositive ? '↑' : '↓'} {priceVariation.value}</span>
                        )}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tendencia */}
          <div className="bg-white overflow-hidden shadow-md rounded-xl transition-all duration-300 hover:shadow-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gradient-to-br from-purple-500 to-purple-600 rounded-md p-3">
                  {trendInfo.icon || (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  )}
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Tendencia</dt>
                    <dd className="flex items-center">
                      <div className="text-2xl font-semibold text-gray-900">{trendInfo.trend}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recomendación */}
          <div className="bg-white overflow-hidden shadow-md rounded-xl transition-all duration-300 hover:shadow-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-gradient-to-br from-green-500 to-green-600 rounded-md p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Recomendación</dt>
                    <dd>
                      <div className={`text-xl font-medium ${recommendation.color}`}>
                        {recommendation.text}
                      </div>
                      <div className="text-sm text-gray-500">
                        Basado en tendencias recientes
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Gráficos */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de evolución de precios */}
          <div className="bg-white overflow-hidden shadow-md rounded-xl transition-all duration-300 hover:shadow-lg">
            <PriceLineChart 
              data={priceData} 
              title={`Evolución de precio: ${selectedProduct?.name || ''}`} 
            />
          </div>
          
          {/* Gráfico de inflación */}
          <div className="bg-white overflow-hidden shadow-md rounded-xl transition-all duration-300 hover:shadow-lg">
            <InflationBarChart 
              data={priceData} 
              title={`Inflación mensual: ${selectedProduct?.name || ''}`} 
            />
          </div>
        </div>
      </div>
      
      {/* Recomendaciones */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white overflow-hidden shadow-md rounded-xl transition-all duration-300 hover:shadow-lg">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Recomendaciones de compra
            </h2>
            
            {recommendations.length > 0 ? (
              <div className="space-y-4">
                {recommendations.map(rec => (
                  <div 
                    key={rec.id} 
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">{rec.product}</h3>
                        <p className="text-sm text-gray-600">
                          Precio actual: <span className="font-medium">${rec.currentPrice.toLocaleString()}/kg</span> 
                          <span className="mx-2">•</span> 
                          Tendencia: <span className="font-medium">{
                            rec.trend === 'alza' 
                              ? 'Al alza' 
                              : rec.trend === 'baja' 
                                ? 'A la baja' 
                                : 'Estable'
                          }</span>
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                        ${rec.recommendation === 'comprar' 
                          ? 'bg-green-100 text-green-800' 
                          : rec.recommendation === 'esperar' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-blue-100 text-blue-800'}`}>
                        {rec.recommendation === 'comprar' 
                          ? 'Buen momento para comprar' 
                          : rec.recommendation === 'esperar' 
                            ? 'Esperar mejor precio' 
                            : 'Precio normal'}
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">{rec.reason}</p>
                    </div>
                    {rec.recommendation === 'comprar' && (
                      <div className="mt-3 flex">
                        <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Agregar a lista
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <p className="mt-4 text-gray-500 text-lg">No hay recomendaciones disponibles en este momento.</p>
                <p className="text-gray-500">Intente seleccionar un producto diferente o vuelva más tarde.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Sección informativa */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center">
            <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-indigo-800 mb-1">¿Cómo interpretar los datos?</h3>
              <p className="text-indigo-600">
                Los precios mostrados corresponden al seguimiento de mercados mayoristas en Colombia. 
                Las recomendaciones se basan en tendencias históricas y análisis estacional.
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">Los gráficos muestran la evolución de precios en el periodo seleccionado</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">Actualización diaria de precios de mercados mayoristas del país</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">Datos obtenidos del Sistema de Información de Precios SIPSA</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;