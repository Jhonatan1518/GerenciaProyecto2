// src/pages/Estadisticas.js
import React from 'react';
import realMadridLogo from '../assets/realmadrid-logo.png';
import barcelonaLogo from '../assets/barcelona-logo.png';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import '../styles/Estadisticas.css';

const possessionData = [
  { name: 'Real Madrid', value: 55 },
  { name: 'FC Barcelona', value: 45 },
];

const COLORS = ['#2196f3', '#f44336'];

function Estadisticas() {
  return (
    <div className="app bg-black text-white min-h-screen p-4 font-sans">
      <header className="text-center mb-6">
        <div className="flex items-center justify-between px-6">
          <img src={realMadridLogo} alt="Real Madrid" className="h-16" />
          <h1 className="text-2xl font-bold">Estadísticas</h1>
          <img src={barcelonaLogo} alt="FC Barcelona" className="h-16" />
        </div>
        <h2 className="text-xl mt-2">Real Madrid vs FC Barcelona</h2>
        <p className="text-gray-400">
          Estadio Santiago Bernabeu<br />16 mayo 2025 20:00
        </p>
      </header>

      <div className="estadisticas-container">
        {/* Tiros a puerta */}
        <div className="estadisticas-card">
          <h3>Tiros a puerta</h3>
          <div className="info-row">
            <span>Real Madrid</span>
            <span>10</span>
          </div>
          <div className="bar-container">
            <div className="bar-fill blue" style={{ width: '40%' }}></div>
          </div>
          <div className="info-row">
            <span>FC Barcelona</span>
            <span>15</span>
          </div>
          <div className="bar-container">
            <div className="bar-fill red" style={{ width: '60%' }}></div>
          </div>
        </div>

        {/* Posesión de balón */}
        <div className="estadisticas-card">
          <h3>Posesión de balón</h3>
          <div className="estadisticas-piechart">
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie
                  data={possessionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={45}
                  dataKey="value"
                >
                  {possessionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="legend">
            <span className="text-blue-400">Real Madrid 55%</span>
            <span className="text-red-400">FC Barcelona 45%</span>
          </div>
        </div>

        {/* Faltas cometidas */}
        <div className="estadisticas-card">
          <h3>Faltas cometidas</h3>
          <div className="info-row">
            <span>Real Madrid</span>
            <span>8</span>
          </div>
          <div className="bar-container">
            <div className="bar-fill blue" style={{ width: '40%' }}></div>
          </div>
          <div className="info-row">
            <span>FC Barcelona</span>
            <span>12</span>
          </div>
          <div className="bar-container">
            <div className="bar-fill red" style={{ width: '60%' }}></div>
          </div>
        </div>

        {/* Tarjetas */}
        <div className="estadisticas-card">
          <h3>Tarjetas</h3>
          <div className="info-row">
            <span>Amarillas</span>
            <span>2 - 3</span>
          </div>
          <div className="info-row">
            <span>Rojas</span>
            <span>0 - 0</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Estadisticas;
