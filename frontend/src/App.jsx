import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ProductDetail from './pages/ProductDetail';

// Páginas temporales para las rutas adicionales
const Products = () => <div className="p-4">Página de Productos (En desarrollo)</div>;
const Recommendations = () => <div className="p-4">Página de Recomendaciones (En desarrollo)</div>;

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;