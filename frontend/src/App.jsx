import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ProductDetail from './pages/ProductDetail';

// Páginas temporales para las rutas adicionales (mejoradas visualmente)
const Products = () => (
  <div className="bg-white shadow rounded-lg p-8 max-w-4xl mx-auto">
    <div className="text-center mb-8">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      <h1 className="text-2xl font-bold text-gray-900">Catálogo de Productos</h1>
      <p className="mt-2 text-gray-600">Esta página está actualmente en desarrollo. Pronto podrás ver todos los productos disponibles.</p>
    </div>
    <div className="flex justify-center">
      <a href="/" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
        Volver al Dashboard
      </a>
    </div>
  </div>
);

const Recommendations = () => (
  <div className="bg-white shadow rounded-lg p-8 max-w-4xl mx-auto">
    <div className="text-center mb-8">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
      <h1 className="text-2xl font-bold text-gray-900">Recomendaciones Personalizadas</h1>
      <p className="mt-2 text-gray-600">Esta página está actualmente en desarrollo. Pronto tendrás recomendaciones basadas en tendencias de precios.</p>
    </div>
    <div className="flex justify-center">
      <a href="/" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
        Volver al Dashboard
      </a>
    </div>
  </div>
);

// Página para manejo de errores 404
const NotFound = () => (
  <div className="bg-white shadow rounded-lg p-8 max-w-4xl mx-auto text-center">
    <div className="mb-8">
      <div className="text-indigo-500 text-9xl font-bold">404</div>
      <h1 className="text-2xl font-bold text-gray-900 mt-4">Página no encontrada</h1>
      <p className="mt-2 text-gray-600">Lo sentimos, la página que buscas no existe o ha sido movida.</p>
    </div>
    <div className="flex justify-center">
      <a href="/" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
        Volver al Dashboard
      </a>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;