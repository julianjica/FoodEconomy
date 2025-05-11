// Frontend API utility with support for both mock and real data

import { priceData, recommendations, products, cities } from '../data/mockData';

// API base URL - change this to your FastAPI backend URL
const API_BASE_URL = 'http://localhost:8000';

// Flag to toggle between mock and real data
const USE_REAL_DATA = true;

/**
 * Fetches price data for a specific product and city
 */
export const fetchPriceData = async (productId, cityName) => {
  console.log(`Fetching price data for product ${productId} in ${cityName}`);
  
  if (!USE_REAL_DATA) {
    // Use mock data (original implementation)
    await new Promise(resolve => setTimeout(resolve, 500));
    return priceData;
  }
  
  try {
    // Use real API
    const response = await fetch(`${API_BASE_URL}/price-data/${productId}/${encodeURIComponent(cityName)}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching price data:', error);
    
    // Fallback to mock data if API fails
    return priceData;
  }
};

/**
 * Fetches product purchase recommendations
 */
export const fetchRecommendations = async () => {
  if (!USE_REAL_DATA) {
    // Use mock data (original implementation)
    await new Promise(resolve => setTimeout(resolve, 700));
    return recommendations;
  }
  
  try {
    // Use real API
    const response = await fetch(`${API_BASE_URL}/recommendations`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    
    // Fallback to mock data if API fails
    return recommendations;
  }
};

/**
 * Fetches list of available products
 */
export const fetchProducts = async () => {
  if (!USE_REAL_DATA) {
    // Use mock data (original implementation)
    await new Promise(resolve => setTimeout(resolve, 300));
    return products;
  }
  
  try {
    // Use real API
    const response = await fetch(`${API_BASE_URL}/products`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    
    // Fallback to mock data if API fails
    return products;
  }
};

/**
 * Fetches list of available cities
 */
export const fetchCities = async () => {
  if (!USE_REAL_DATA) {
    // Use mock data (original implementation)
    await new Promise(resolve => setTimeout(resolve, 300));
    return cities;
  }
  
  try {
    // Use real API
    const response = await fetch(`${API_BASE_URL}/cities`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching cities:', error);
    
    // Fallback to mock data if API fails
    return cities;
  }
};

/**
 * Fetches detailed product information
 */
export const fetchProductDetail = async (productId) => {
  if (!USE_REAL_DATA) {
    // Return mock data for product detail
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // These are just examples that match the structure used in ProductDetail.jsx
    return {
      historicalData: [
        { year: '2020', price: 2100 },
        { year: '2021', price: 2330 },
        { year: '2022', price: 2450 },
        { year: '2023', price: 2780 },
        { year: '2024', price: 2920 },
        { year: '2025', price: 3050 },
      ],
      cityPriceData: [
        { city: 'BOGOTÁ, D.C.', price: 3050 },
        { city: 'MEDELLÍN', price: 2950 },
        { city: 'CALI', price: 3120 },
        { city: 'BUCARAMANGA', price: 3210 },
        { city: 'BARRANQUILLA', price: 3320 },
        { city: 'PEREIRA', price: 2800 },
        { city: 'CARTAGENA DE INDIAS', price: 3400 },
      ],
      seasonalityData: [
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
      ],
    };
  }
  
  try {
    // Use real API
    const response = await fetch(`${API_BASE_URL}/product-detail/${productId}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching product detail:', error);
    
    // Return mock data as fallback
    return {
      historicalData: [
        { year: '2020', price: 2100 },
        { year: '2021', price: 2330 },
        { year: '2022', price: 2450 },
        { year: '2023', price: 2780 },
        { year: '2024', price: 2920 },
        { year: '2025', price: 3050 },
      ],
      cityPriceData: [
        { city: 'BOGOTÁ, D.C.', price: 3050 },
        { city: 'MEDELLÍN', price: 2950 },
        { city: 'CALI', price: 3120 },
        { city: 'BUCARAMANGA', price: 3210 },
        { city: 'BARRANQUILLA', price: 3320 },
        { city: 'PEREIRA', price: 2800 },
        { city: 'CARTAGENA DE INDIAS', price: 3400 },
      ],
      seasonalityData: [
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
      ],
    };
  }
};