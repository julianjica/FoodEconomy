import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchPriceData, fetchProducts, fetchCities } from '../utils/api';

// Datos ficticios para análisis histórico
const historicalData = [
  { year: '2020', price: 2100 },
  { year: '2021', price: 2330 },
  { year: '2022', price: 2450 },
  { year: '2023', price: 2780 },
  { year: '2024', price: 2920 },
  { year: '2025', price: 3050 },
];

// Datos ficticios para precios por ciudad
const cityPriceData = [
  { city: 'BOGOTÁ, D.C.', price: 3050 },
  { city: 'MEDELLÍN', price: 2950 },
  { city: 'CALI', price: 3120 },
  { city: 'BUCARAMANGA', price: 3210 },
  { city: 'BARRANQUILLA', price: 3320 },
  { city: 'PEREIRA', price: 2800 },
  { city: 'CARTAGENA DE INDIAS', price: 3400 },
];

// Datos ficticios para estacionalidad
const seasonalityData = [
  { month: 'Ene', index: 95 },
  { month: 'Feb', index: 97 },
  { month: 'Mar', index: 100 },
  { month: 'Abr', index: 103 },
  { month: 'May', index: 108 },
  { month: 'Jun', index: 105 },
  { month: 'Jul', index: 102 },
  { month: 'Ago', index: 98 },
  { month: 'Sep', index: 97 },
  { month: 'Oct', index: 94 },
  { month: 'Nov', index: 95 },
  { month: 'Dic', index: 98 },
];

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceData, setPriceData] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  // Para seleccionar periodos de análisis
  const [analysisPeriod, setAnalysisPeriod] = useState('month');

  // Cargar datos del producto
  useEffect(() => {
    const loadProductData = async () => {
      try {
        setLoading(true);
        // Cargar lista de productos
        const productsData = await fetchProducts();
        const foundProduct = productsData.find(p => p.id === parseInt(productId));
        
        if (foundProduct) {
          setProduct(foundProduct);
          
          // Cargar datos de precios para Bogotá (o tu ciudad principal)
          const priceInfo = await fetchPriceData(foundProduct.id, 'BOGOTÁ, D.C.');
          setPriceData(priceInfo);
          
          // Establecer precio actual
          if (priceInfo.length > 0) {
            setCurrentPrice(priceInfo[priceInfo.length - 1].price);
          }
          
          // Cargar lista de ciudades
          const citiesData = await fetchCities();
          setCities(citiesData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading product data:', error);
        setLoading(false);
      }
    };
    
    loadProductData();
  }, [productId]);

  // Si está cargando o no se encuentra el producto
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 pt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-3 text-lg text-gray-700">Cargando información del producto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 pt-20">
        <div className="bg-white shadow-card rounded-xl p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-xl font-semibold text-gray-800">Producto no encontrado</h1>
          <p className="text-gray-600 mt-2">Lo sentimos, el producto que estás buscando no existe o ha sido removido.</p>
          <Link 
            to="/" 
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Volver al Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Calcular tendencia
  const calculateTrend = () => {
    if (priceData.length < 2) return { trend: 'Sin datos suficientes', color: 'text-gray-500' };
    
    const lastPrice = priceData[priceData.length - 1].price;
    const prevPrice = priceData[priceData.length - 2].price;
    
    if (lastPrice > prevPrice) {
      return { trend: 'Al alza', color: 'text-red-600' };
    } else if (lastPrice < prevPrice) {
      return { trend: 'A la baja', color: 'text-green-600' };
    } else {
      return { trend: 'Estable', color: 'text-yellow-600' };
    }
  };

  const trend = calculateTrend();

  // Calcular variación anual
  const calculateYearlyVariation = () => {
    if (historicalData.length < 2) return { value: 'N/A', isPositive: false };
    
    const lastYearPrice = historicalData[historicalData.length - 1].price;
    const previousYearPrice = historicalData[historicalData.length - 2].price;
    
    const variation = ((lastYearPrice / previousYearPrice - 1) * 100).toFixed(1);
    return { 
      value: `${variation}%`, 
      isPositive: parseFloat(variation) >= 0 
    };
  };

  const yearlyVariation = calculateYearlyVariation();

  // Determinar mejor ciudad para comprar
  const determineBestCity = () => {
    if (cityPriceData.length === 0) return null;
    
    return cityPriceData.reduce((best, city) => 
      city.price < best.price ? city : best, cityPriceData[0]);
  };

  const bestCity = determineBestCity();

  return (
    <div className="bg-gray-50 min-h-screen pb-12 pt-16">
      {/* Encabezado */}
      <div className="bg-white shadow-soft">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center">
                <Link to="/" className="text-blue-600 hover:text-blue-700 transition-colors mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                <span className={`ml-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  trend.trend === 'Al alza' 
                    ? 'bg-red-100 text-red-800' 
                    : trend.trend === 'A la baja' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {trend.trend}
                </span>
              </div>
              <p className="mt-1 text-gray-500">
                Análisis de precios y tendencias para este producto
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <span className="text-3xl font-bold text-gray-900">${currentPrice?.toLocaleString() || 'N/A'}</span>
              <span className="text-sm ml-2 font-medium text-gray-500">por kg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Pestañas */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Resumen
            </button>
            <button
              onClick={() => setActiveTab('historical')}
              className={`${
                activeTab === 'historical'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Histórico
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`${
                activeTab === 'comparison'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Comparativa
            </button>
            <button
              onClick={() => setActiveTab('seasonality')}
              className={`${
                activeTab === 'seasonality'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Estacionalidad
            </button>
          </nav>
        </div>

        {/* Contenido de pestañas */}
        <div className="mt-8">
          {/* Pestaña: Resumen */}
          {activeTab === 'overview' && (
            <div>
              {/* Estadísticas rápidas */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                {/* Precio actual */}
                <div className="bg-white overflow-hidden shadow-card rounded-xl transition-all duration-300 hover:shadow-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Precio actual
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">
                              ${currentPrice?.toLocaleString() || 'N/A'}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tendencia */}
                <div className="bg-white overflow-hidden shadow-card rounded-xl transition-all duration-300 hover:shadow-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Tendencia
                          </dt>
                          <dd>
                            <div className={`text-lg font-medium ${trend.color}`}>
                              {trend.trend}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mejor precio */}
                <div className="bg-white overflow-hidden shadow-card rounded-xl transition-all duration-300 hover:shadow-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Mejor precio en
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">
                              {bestCity ? bestCity.city : 'N/A'}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gráfico reciente */}
              <div className="bg-white shadow-card rounded-xl overflow-hidden mb-8">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Evolución de precio reciente</h3>
                </div>
                <div className="p-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={priceData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4870f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#4870f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip 
                          formatter={(value) => [`$${value.toLocaleString()}`, 'Precio']}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="price" 
                          stroke="#4870f6" 
                          fillOpacity={1} 
                          fill="url(#colorPrice)" 
                          name="Precio"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Recomendación */}
              <div className="bg-white shadow-card rounded-xl overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Recomendación</h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="sm:flex sm:items-start sm:justify-between">
                    <div className="sm:flex sm:items-start">
                      {trend.trend === 'Al alza' ? (
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      ) : trend.trend === 'A la baja' ? (
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                      )}
                      <div className="mt-3 sm:mt-0 sm:ml-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          {trend.trend === 'Al alza' 
                            ? 'Esperar para comprar' 
                            : trend.trend === 'A la baja' 
                              ? 'Buen momento para comprar' 
                              : 'Precio estable'}
                        </h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            {trend.trend === 'Al alza' 
                              ? `El precio está subiendo. Si puedes esperar, es recomendable hacerlo. Si necesitas comprar ahora, considera adquirir en ${bestCity?.city || 'una ciudad con mejor precio'}.` 
                              : trend.trend === 'A la baja' 
                                ? 'El precio está bajando. Es un buen momento para comprar, especialmente en grandes cantidades.' 
                                : 'El precio se mantiene estable. Compra según tus necesidades sin preocupaciones por cambios bruscos.'}
                          </p>
                        </div>
                      </div>
                    </div>
                    {trend.trend === 'A la baja' && (
                      <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:flex sm:items-center">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          Agregar a lista
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pestaña: Histórico */}
          {activeTab === 'historical' && (
            <div>
              {/* Selector de periodo */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Análisis histórico de precios</h2>
                  <div className="flex rounded-md shadow-sm">
                    <button
                      type="button"
                      className={`relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium transition-colors
                        ${analysisPeriod === 'month' ? 'text-blue-700 bg-blue-50 z-10' : 'text-gray-700 hover:bg-gray-50'}`}
                      onClick={() => setAnalysisPeriod('month')}
                    >
                      Mensual
                    </button>
                    <button
                      type="button"
                      className={`relative -ml-px inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium transition-colors
                        ${analysisPeriod === 'quarter' ? 'text-blue-700 bg-blue-50 z-10' : 'text-gray-700 hover:bg-gray-50'}`}
                      onClick={() => setAnalysisPeriod('quarter')}
                    >
                      Trimestral
                    </button>
                    <button
                      type="button"
                      className={`relative -ml-px inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium transition-colors
                        ${analysisPeriod === 'year' ? 'text-blue-700 bg-blue-50 z-10' : 'text-gray-700 hover:bg-gray-50'}`}
                      onClick={() => setAnalysisPeriod('year')}
                    >
                      Anual
                    </button>
                  </div>
                </div>
              </div>

              {/* Estadísticas anuales */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
                <div className="bg-white overflow-hidden shadow-card rounded-xl">
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Precio promedio (2025)
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      $3,050
                    </dd>
                  </div>
                </div>
                <div className="bg-white overflow-hidden shadow-card rounded-xl">
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Variación anual
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      {yearlyVariation.value}
                    </dd>
                  </div>
                </div>
                <div className="bg-white overflow-hidden shadow-card rounded-xl">
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Mes más económico
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      Octubre
                    </dd>
                  </div>
                </div>
              </div>

              {/* Gráfico histórico */}
              <div className="bg-white shadow-card rounded-xl overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Evolución de precios históricos</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    {analysisPeriod === 'month' ? 'Datos mensuales del último año' : 
                     analysisPeriod === 'quarter' ? 'Datos trimestrales de los últimos 3 años' : 
                     'Datos anuales de los últimos 5 años'}
                  </p>
                </div>
                <div className="p-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={historicalData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value.toLocaleString()}`, 'Precio']} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke="#4870f6"
                          activeDot={{ r: 8 }}
                          name="Precio promedio"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              {/* Tabla de datos históricos */}
              <div className="mt-8 flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow-soft overflow-hidden border border-gray-200 sm:rounded-xl">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Año
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Precio promedio
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Variación
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tendencia
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {historicalData.map((yearData, index) => {
                            const prevYear = index > 0 ? historicalData[index - 1].price : null;
                            const variation = prevYear ? ((yearData.price / prevYear - 1) * 100).toFixed(1) : null;
                            
                            return (
                              <tr key={yearData.year}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {yearData.year}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  ${yearData.price.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {variation ? (
                                    <span className={variation > 0 ? 'text-red-600' : 'text-green-600'}>
                                      {variation > 0 ? '+' : ''}{variation}%
                                    </span>
                                  ) : (
                                    '—'
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {variation ? (
                                    <span className="inline-flex items-center">
                                      {variation > 0 ? (
                                        <>
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                                          </svg>
                                          Alza
                                        </>
                                      ) : (
                                        <>
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                                          </svg>
                                          Baja
                                        </>
                                      )}
                                    </span>
                                  ) : (
                                    '—'
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pestaña: Comparativa */}
          {activeTab === 'comparison' && (
            <div>
              <div className="bg-white shadow-card rounded-xl overflow-hidden mb-8">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Precios por ciudad</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Comparativa de precios actuales en diferentes ciudades
                  </p>
                </div>
                <div className="p-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={cityPriceData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="city" type="category" width={120} />
                        <Tooltip formatter={(value) => [`${value.toLocaleString()}`, 'Precio']} />
                        <Legend />
                        <Bar dataKey="price" name="Precio" fill="#4870f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Tabla de comparación */}
              <div className="bg-white shadow-card overflow-hidden sm:rounded-xl">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Detalle de precios por ciudad</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Precio actual, variación y recomendación por ciudad
                  </p>
                </div>
                <div className="border-t border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ciudad
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Precio ($/kg)
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Diferencia vs. promedio
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Recomendación
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {cityPriceData.map((city) => {
                          // Calcular promedio
                          const avgPrice = cityPriceData.reduce((sum, city) => sum + city.price, 0) / cityPriceData.length;
                          // Calcular diferencia porcentual
                          const diffPercent = ((city.price / avgPrice - 1) * 100).toFixed(1);
                          // Determinar recomendación
                          const isGoodPrice = city.price < avgPrice;
                          
                          return (
                            <tr key={city.city}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {city.city}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ${city.price.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span className={diffPercent > 0 ? 'text-red-600' : 'text-green-600'}>
                                  {diffPercent > 0 ? '+' : ''}{diffPercent}%
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {isGoodPrice ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Buen precio
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    Precio elevado
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pestaña: Estacionalidad */}
          {activeTab === 'seasonality' && (
            <div>
              <div className="bg-white shadow-card rounded-xl overflow-hidden mb-8">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Índice de estacionalidad</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Variación mensual de precios (100 = precio promedio anual)
                  </p>
                </div>
                <div className="p-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={seasonalityData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[90, 110]} />
                        <Tooltip />
                        <Legend />
                        <Bar 
                          dataKey="index" 
                          name="Índice estacional" 
                          fill="#82ca9d"
                          background={{ fill: '#eee' }}
                        />
                        <Line
                          type="monotone"
                          dataKey="index"
                          stroke="#ff7300"
                          yAxisId={0}
                          dot={false}
                          activeDot={false}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Mejor momento para comprar */}
              <div className="bg-white shadow-card rounded-xl overflow-hidden mb-8">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Análisis de estacionalidad</h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-base font-medium text-gray-900 mb-3">Mejor momento para comprar</h4>
                      <div className="bg-green-50 rounded-lg p-4 flex items-start">
                        <div className="flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-green-800">
                            Octubre - Diciembre
                          </p>
                          <p className="mt-2 text-xs text-green-700">
                            Los precios tienden a ser más bajos durante estos meses debido a mayor disponibilidad del producto.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-gray-900 mb-3">Precios más altos</h4>
                      <div className="bg-red-50 rounded-lg p-4 flex items-start">
                        <div className="flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-800">
                            Mayo - Junio
                          </p>
                          <p className="mt-2 text-xs text-red-700">
                            Los precios suelen ser más altos en esta época por menor oferta y mayor demanda.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-base font-medium text-gray-900 mb-3">Recomendación anual</h4>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Mes
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Índice
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Estado
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Acción recomendada
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {seasonalityData.map((month) => (
                            <tr key={month.month}>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                {month.month}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {month.index}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {month.index < 98 ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Bajo
                                  </span>
                                ) : month.index > 102 ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    Alto
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Normal
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {month.index < 98 ? (
                                  <span className="text-green-600">Comprar en volumen</span>
                                ) : month.index > 102 ? (
                                  <span className="text-red-600">Reducir consumo</span>
                                ) : (
                                  <span className="text-gray-600">Compra normal</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;