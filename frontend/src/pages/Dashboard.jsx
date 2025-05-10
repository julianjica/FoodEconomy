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

  if (loading && (!products.length || !cities.length)) {
    return <div className="text-center py-10">Cargando datos...</div>;
  }

  return (
    <div className="px-4 py-6">
      {/* Título y descripción */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard de Precios</h1>
        <p className="text-gray-600">Monitoreo de precios y tendencias de alimentos</p>
      </div>
      
      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
            <select
              id="product"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedProduct?.id || ''}
              onChange={handleProductChange}
            >
              {products.map(product => (
                <option key={product.id} value={product.id}>{product.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
            <select
              id="city"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedCity}
              onChange={handleCityChange}
            >
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Estadísticas básicas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Precio actual</h3>
          <p className="text-2xl font-semibold">${priceData[priceData.length - 1]?.price || 'N/A'}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Variación anual</h3>
          <p className="text-2xl font-semibold">
            {priceData.length > 1 ? `${((priceData[priceData.length - 1]?.price / priceData[0]?.price - 1) * 100).toFixed(1)}%` : 'N/A'}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Tendencia</h3>
          <p className="text-2xl font-semibold">
            {priceData.length > 2 && priceData[priceData.length - 1]?.price > priceData[priceData.length - 2]?.price 
              ? 'Al alza' 
              : priceData.length > 2 ? 'A la baja' : 'N/A'}
          </p>
        </div>
      </div>
      
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <PriceLineChart 
          data={priceData} 
          title={`Evolución de precio: ${selectedProduct?.name || ''}`} 
        />
        
        <InflationBarChart 
          data={priceData} 
          title={`Inflación mensual: ${selectedProduct?.name || ''}`} 
        />
      </div>
      
      {/* Recomendaciones */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recomendaciones de compra</h2>
        
        {recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.map(rec => (
              <div key={rec.id} className="border border-gray-200 rounded-md p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-md font-medium text-gray-900">{rec.product}</h3>
                    <p className="text-sm text-gray-500">
                      Precio actual: ${rec.currentPrice}/kg - Tendencia: {rec.trend === 'alza' ? 'Al alza' : rec.trend === 'baja' ? 'A la baja' : 'Estable'}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${rec.recommendation === 'comprar' ? 'bg-green-100 text-green-800' : 
                      rec.recommendation === 'esperar' ? 'bg-red-100 text-red-800' : 
                      'bg-blue-100 text-blue-800'}`}>
                    {rec.recommendation === 'comprar' ? 'Buen momento para comprar' : 
                      rec.recommendation === 'esperar' ? 'Esperar mejor precio' : 
                      'Precio normal'}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">{rec.reason}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No hay recomendaciones disponibles en este momento.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;