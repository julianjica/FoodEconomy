// Archivo para funciones de API y manipulación de datos

// Función simulada para obtener datos de precios
export const fetchPriceData = async (productId, cityName) => {
    // En una implementación real, esto sería una llamada a tu API
    console.log(`Fetching price data for product ${productId} in ${cityName}`);
    
    // Simulamos una latencia de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Por ahora, devolvemos datos ficticios de mockData.js
    // En el futuro, esto se conectará con tu backend
    return import('../data/mockData')
      .then(module => module.priceData);
  };
  
  // Función simulada para obtener recomendaciones
  export const fetchRecommendations = async () => {
    // Simulamos una latencia de red
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Por ahora, devolvemos datos ficticios
    return import('../data/mockData')
      .then(module => module.recommendations);
  };
  
  // Función simulada para obtener lista de productos
  export const fetchProducts = async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return import('../data/mockData')
      .then(module => module.products);
  };
  
  // Función simulada para obtener lista de ciudades
  export const fetchCities = async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return import('../data/mockData')
      .then(module => module.cities);
  };