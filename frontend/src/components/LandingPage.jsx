import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-blue-900">
        <div className="absolute inset-0">
          <svg className="absolute left-full transform -translate-y-3/4 -translate-x-1/4 sm:left-3/4 md:translate-y-0" width="404" height="404" fill="none" viewBox="0 0 404 404" aria-hidden="true">
            <defs>
              <pattern id="ad119f34-7694-4c31-947f-5c9d249b21f3" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="4" className="text-blue-400" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="404" fill="url(#ad119f34-7694-4c31-947f-5c9d249b21f3)" />
          </svg>
        </div>
        
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:space-x-8">
            <div className="md:w-1/2">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Análisis inteligente de precios alimentarios
              </h1>
              <p className="mt-6 max-w-lg text-xl text-blue-100">
                PriceTrack te ayuda a tomar decisiones de compra informadas con análisis de precios en tiempo real y recomendaciones basadas en datos.
              </p>
              <div className="mt-10 flex space-x-4">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 shadow-md transition-all duration-300"
                >
                  Comenzar ahora
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 bg-opacity-30 hover:bg-opacity-40 transition-all duration-300"
                >
                  Ver características
                </a>
              </div>
            </div>
            <div className="mt-12 md:mt-0 md:w-1/2">
              <div className="relative bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-70"></div>
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="font-semibold text-gray-800">Análisis de precios</div>
                    <div className="text-sm text-gray-500">Última actualización: {new Date().toLocaleDateString()}</div>
                  </div>
                  <div className="h-64 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Eje X */}
                      <line x1="40" y1="160" x2="360" y2="160" stroke="#E5E7EB" strokeWidth="2" />
                      {/* Eje Y */}
                      <line x1="40" y1="20" x2="40" y2="160" stroke="#E5E7EB" strokeWidth="2" />
                      
                      {/* Línea de datos */}
                      <path d="M40 120 L80 110 L120 115 L160 90 L200 100 L240 80 L280 60 L320 50 L360 40" stroke="#4870f6" strokeWidth="3" fill="none" />
                      
                      {/* Área bajo la curva con gradiente */}
                      <path d="M40 160 L40 120 L80 110 L120 115 L160 90 L200 100 L240 80 L280 60 L320 50 L360 40 L360 160 Z" fill="url(#gradient)" fillOpacity="0.2" />
                      
                      {/* Puntos de datos */}
                      <circle cx="40" cy="120" r="4" fill="#4870f6" />
                      <circle cx="80" cy="110" r="4" fill="#4870f6" />
                      <circle cx="120" cy="115" r="4" fill="#4870f6" />
                      <circle cx="160" cy="90" r="4" fill="#4870f6" />
                      <circle cx="200" cy="100" r="4" fill="#4870f6" />
                      <circle cx="240" cy="80" r="4" fill="#4870f6" />
                      <circle cx="280" cy="60" r="4" fill="#4870f6" />
                      <circle cx="320" cy="50" r="4" fill="#4870f6" />
                      <circle cx="360" cy="40" r="4" fill="#4870f6" />
                      
                      {/* Etiquetas eje X */}
                      <text x="40" y="175" textAnchor="middle" fill="#6B7280" fontSize="10">Ene</text>
                      <text x="80" y="175" textAnchor="middle" fill="#6B7280" fontSize="10">Feb</text>
                      <text x="120" y="175" textAnchor="middle" fill="#6B7280" fontSize="10">Mar</text>
                      <text x="160" y="175" textAnchor="middle" fill="#6B7280" fontSize="10">Abr</text>
                      <text x="200" y="175" textAnchor="middle" fill="#6B7280" fontSize="10">May</text>
                      <text x="240" y="175" textAnchor="middle" fill="#6B7280" fontSize="10">Jun</text>
                      <text x="280" y="175" textAnchor="middle" fill="#6B7280" fontSize="10">Jul</text>
                      <text x="320" y="175" textAnchor="middle" fill="#6B7280" fontSize="10">Ago</text>
                      <text x="360" y="175" textAnchor="middle" fill="#6B7280" fontSize="10">Sep</text>
                      
                      {/* Definición del gradiente */}
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#4870f6" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#4870f6" stopOpacity="0.1" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-500">Precio actual</div>
                      <div className="text-2xl font-bold text-gray-800">$3,050/kg</div>
                    </div>
                    <div className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                      Buen momento para comprar
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Características</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Decisiones económicas inteligentes
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Monitorea en tiempo real los precios de los alimentos en Colombia y toma decisiones de compra basadas en datos confiables.
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Análisis de tendencias</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Visualiza la evolución histórica de precios y detecta patrones para anticiparte a las subidas y bajadas del mercado. Accede a gráficos interactivos que facilitan la comprensión de las tendencias.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Recomendaciones inteligentes</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Recibe sugerencias personalizadas sobre cuándo comprar cada producto basadas en datos históricos, estacionalidad y proyecciones. Nuestro sistema identifica los mejores momentos para realizar tus compras.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Comparativa por ciudades</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Compara precios entre diferentes ciudades de Colombia y encuentra dónde puedes conseguir los mejores precios para cada producto. Optimiza tus compras según tu ubicación o planifica tus adquisiciones al por mayor.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-blue-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Cómo funciona</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Simple, eficiente y poderoso
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Nuestro sistema actualiza datos diariamente para ofrecerte análisis precisos y recomendaciones oportunas.
            </p>
          </div>

          <div className="mt-16">
            <div className="relative">
              {/* Línea conectora */}
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-blue-300 border-dashed"></div>
              </div>
              
              {/* Pasos */}
              <div className="relative flex flex-wrap justify-between">
                <div className="bg-blue-50 px-4 mb-8 md:mb-0">
                  <div className="w-64">
                    <div className="relative flex items-center justify-center h-16 w-16 rounded-full bg-blue-600 text-white mx-auto">
                      <span className="text-xl font-bold">1</span>
                    </div>
                    <h3 className="mt-6 text-lg font-medium text-gray-900 text-center">Recolección de datos</h3>
                    <p className="mt-2 text-base text-gray-500 text-center">
                      Obtenemos precios actualizados de mercados mayoristas en todo el país para garantizar información precisa y oportuna.
                    </p>
                  </div>
                </div>
                
                <div className="bg-blue-50 px-4 mb-8 md:mb-0">
                  <div className="w-64">
                    <div className="relative flex items-center justify-center h-16 w-16 rounded-full bg-blue-600 text-white mx-auto">
                      <span className="text-xl font-bold">2</span>
                    </div>
                    <h3 className="mt-6 text-lg font-medium text-gray-900 text-center">Análisis de tendencias</h3>
                    <p className="mt-2 text-base text-gray-500 text-center">
                      Procesamos la información con algoritmos especializados que identifican patrones y proyectan tendencias de precios.
                    </p>
                  </div>
                </div>
                
                <div className="bg-blue-50 px-4">
                  <div className="w-64">
                    <div className="relative flex items-center justify-center h-16 w-16 rounded-full bg-blue-600 text-white mx-auto">
                      <span className="text-xl font-bold">3</span>
                    </div>
                    <h3 className="mt-6 text-lg font-medium text-gray-900 text-center">Recomendaciones</h3>
                    <p className="mt-2 text-base text-gray-500 text-center">
                      Generamos consejos personalizados para optimizar tus compras, indicando cuándo y dónde adquirir cada producto.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center mb-6">
              <div className="flex-shrink-0 bg-blue-100 rounded-full p-3 mr-4 mb-4 md:mb-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">¿Qué encontrarás en la plataforma?</h3>
                <p className="text-gray-600">
                  En PriceTrack tendrás acceso a un completo dashboard con gráficos interactivos, comparativas de precios, historial de variaciones y recomendaciones personalizadas. Toda la información está organizada de manera intuitiva para facilitarte la toma de decisiones.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Dashboard principal</h4>
                <p className="text-sm text-gray-600">Visualiza gráficos y estadísticas de precios actualizados para cada producto y ciudad.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Análisis detallado</h4>
                <p className="text-sm text-gray-600">Accede a información histórica, estacional y comparativa para cada producto.</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Recomendaciones</h4>
                <p className="text-sm text-gray-600">Recibe consejos sobre los mejores momentos para realizar tus compras.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-700">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-20 sm:px-6 lg:px-8 lg:py-24">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">¿Listo para optimizar tus decisiones de compra?</span>
            <span className="block text-blue-200">Comienza a usar PriceTrack hoy mismo.</span>
          </h2>
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 transition-colors duration-300"
              >
                Ir al Dashboard
              </Link>
            </div>
            <div className="inline-flex">
              <a
                href="#features"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 bg-opacity-60 hover:bg-opacity-70 transition-colors duration-300"
              >
                Conocer más funcionalidades
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <div className="bg-gray-50 py-8 text-center">
        <p className="text-sm text-gray-500">
          PriceTrack - Sistema de análisis inteligente de precios | Desarrollado para ayudar a optimizar decisiones de compra
        </p>
      </div>
    </div>
  );
};

export default LandingPage;