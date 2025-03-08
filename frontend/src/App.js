import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import CarouselPage from './pages/CarouselPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/carousel" element={<CarouselPage />} />
      </Routes>
    </Router>
  );
}

export default App;
