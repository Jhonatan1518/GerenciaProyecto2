import React from 'react';
import './App.css';
import realMadridLogo from './assets/realmadrid-logo.png';
import barcelonaLogo from './assets/barcelona-logo.png';

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="team-logos">
          <img src={realMadridLogo} alt="Real Madrid" className="team-logo" />
          <h1>Estadísticas</h1>
          <img src={barcelonaLogo} alt="FC Barcelona" className="team-logo" />
        </div>
        <h2 className="match-title">Real Madrid vs FC Barcelona</h2>
        <p className="match-info">
          Estadio Santiago Bernabeu<br />
          16 mayo 2025 20:00
        </p>
      </header>

      <div className="stats-container">
        <div className="stat-section">
          <h3>Tiros a puerta</h3>
          <div className="stat-row">
            <span className="team-stat">
              <img src={realMadridLogo} alt="Real Madrid" className="stat-logo" />
              Real Madrid
            </span>
            <span className="stat-value">10</span>
          </div>
          <div className="stat-row">
            <span className="team-stat">
              <img src={barcelonaLogo} alt="FC Barcelona" className="stat-logo" />
              FC Barcelona
            </span>
            <span className="stat-value">15</span>
          </div>
        </div>

        <div className="divider"></div>

        <div className="stat-section">
          <h3>Faltas cometidas</h3>
          <div className="stat-row">
            <span className="team-stat">
              <img src={realMadridLogo} alt="Real Madrid" className="stat-logo" />
              Real Madrid
            </span>
            <span className="stat-value">8</span>
          </div>
          <div className="stat-row">
            <span className="team-stat">
              <img src={barcelonaLogo} alt="FC Barcelona" className="stat-logo" />
              FC Barcelona
            </span>
            <span className="stat-value">12</span>
          </div>
        </div>

        <div className="divider"></div>

        <div className="stat-section">
          <h3>Posesión de balón</h3>
          <div className="stat-row">
            <span className="team-stat">
              <img src={realMadridLogo} alt="Real Madrid" className="stat-logo" />
              Real Madrid
            </span>
            <span className="stat-value">55%</span>
          </div>
          <div className="stat-row">
            <span className="team-stat">
              <img src={barcelonaLogo} alt="FC Barcelona" className="stat-logo" />
              FC Barcelona
            </span>
            <span className="stat-value">45%</span>
          </div>
        </div>

        <div className="divider"></div>

        <div className="stat-section">
          <h3>Tarjetas</h3>
          <div className="stat-row">
            <span>Amarillas</span>
            <span className="stat-value">2.3</span>
          </div>
          <div className="stat-row">
            <span>Rojas</span>
            <span className="stat-value">0</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;