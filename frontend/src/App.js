import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UploadPage from './pages/UploadPage';
import CarouselPage from './pages/CarouselPage';

// Função para verificar autenticação
const isAuthenticated = () => {
  return !!localStorage.getItem('loggedInUser');
};

// Rota protegida
const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota padrão leva para a tela de login */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Páginas protegidas */}
        <Route path="/upload" element={<ProtectedRoute element={<UploadPage />} />} />
        <Route path="/carousel" element={<ProtectedRoute element={<CarouselPage />} />} />
      </Routes>
    </Router>
  );
}

export default App;