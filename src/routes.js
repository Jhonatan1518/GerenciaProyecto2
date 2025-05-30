// src/routes.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Estadisticas from './pages/Estadisticas';
import PremierLeagueAnalytics from './pages/PremierLeagueAnalytics'; 

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/estadisticas" element={<Estadisticas />} />
        {/* Nueva ruta para el componente de análisis de la Premier League */}
        <Route path="/premier-league-analytics" element={<PremierLeagueAnalytics />} />
      </Routes>
    </BrowserRouter>
  );
}
