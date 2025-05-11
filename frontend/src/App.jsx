import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ProductDetail from './pages/ProductDetail';
import Products from './pages/Products';
import Recommendations from './pages/Recommendations';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* La página de inicio no usa el Layout general */}
        <Route path="/" element={<LandingPage />} />
        
        {/* El resto de páginas usan el Layout con Navbar */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;