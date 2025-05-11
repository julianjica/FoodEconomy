import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchRecommendations } from '../utils/api';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoading(true);
        const data = await fetchRecommendations();
        setRecommendations(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading recommendations:', error);
        setLoading(false);
      }
    };

    loadRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 mx-auto text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-3 text-lg text-gray-700">Cargando recomendaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Recomendaciones de Compra</h1>
          <p className="mt-2 text-lg text-gray-600">Consejos para optimizar tus compras según tendencias de precios</p>
        </div>

        <div className="bg-white overflow-hidden shadow-md rounded-xl">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Recomendaciones actuales
            </h2>
            
            {recommendations.length > 0 ? (
              <div className="space-y-6">
                {recommendations.map(rec => (
                  <div 
                    key={rec.id} 
                    className="border border-gray-200 rounded-lg p-5 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                      <div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">
                          <Link to={`/product/${rec.id}`} className="hover:text-indigo-600">
                            {rec.product}
                          </Link>
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
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
                        <p className="text-sm text-gray-600">{rec.reason}</p>
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
                    
                    {rec.recommendation === 'comprar' && (
                      <div className="mt-4 flex">
                        <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Agregar a lista
                        </button>
                        <Link 
                          to={`/product/${rec.id}`} 
                          className="ml-3 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Ver detalles
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <p className="mt-4 text-gray-500 text-lg">No hay recomendaciones disponibles en este momento.</p>
                <p className="text-gray-500">Vuelva más tarde para ver recomendaciones actualizadas.</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mt-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center">
            <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-indigo-800 mb-1">¿Cómo funcionan nuestras recomendaciones?</h3>
              <p className="text-indigo-600">
                Nuestro sistema analiza datos históricos, tendencias estacionales y patrones de precios para generar recomendaciones de compra personalizadas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;