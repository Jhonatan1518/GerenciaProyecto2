import React from "react";
import { useNavigate } from "react-router-dom"; // Para navegar entre páginas
import Logo from "../assets/logo-app.png";
import realMadridLogo from "../assets/realmadrid-logo.png";
import barcelonaLogo from "../assets/barcelona-logo.png";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();

  // Datos de las tarjetas
  const stats = [
    { left: "55%", center: "0%", right: "45%" }, // Ejemplo: posesión
    { left: "40%", center: "20%", right: "40%" },
    { left: "50%", center: "10%", right: "40%" },
    { left: "60%", center: "0%", right: "40%" },
  ];

  // Función para manejar el clic y redirigir a /estadisticas
  const handleCardClick = () => {
    navigate("/estadisticas");
  };

  return (
    <div className="home bg-black text-white min-h-screen flex flex-col font-sans">
      {/* Navbar superior */}
      <header className="navbar flex items-center justify-between p-4 bg-gray-900">
        <img src={Logo} alt="Logo" className="h-8" />
        <div className="menu-icon text-xl">☰</div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto p-4">
        {stats.map((stat, index) => (
          <div
            className="match-card bg-gray-800 rounded-2xl p-4 mb-4 shadow"
            key={index}
            onClick={handleCardClick}
          >
            <div className="match-header flex justify-between items-center mb-2">
              <img
                src={realMadridLogo}
                alt="Real Madrid"
                className="team-logo h-10"
              />
              <div className="vs-section text-center">
                <div className="text-sm font-semibold">VS</div>
                <div className="text-xs text-gray-400">LaLiga</div>
              </div>
              <img
                src={barcelonaLogo}
                alt="FC Barcelona"
                className="team-logo h-10"
              />
            </div>
            <div className="progress-bar flex h-2 rounded overflow-hidden">
              <div
                className="progress bg-blue-600"
                style={{ width: stat.left }}
              ></div>
              <div
                className="progress bg-gray-500"
                style={{ width: stat.center }}
              ></div>
              <div
                className="progress bg-red-600"
                style={{ width: stat.right }}
              ></div>
            </div>
          </div>
        ))}
      </main>

      {/* Menú inferior */}
      <nav className="bottom-nav flex justify-around items-center p-2 bg-gray-900 text-xl">
        <div className="nav-item">🏠</div>
        <div className="nav-item">📅</div>
        <div className="nav-item">📊</div>
        <div className="nav-item">👤</div>
      </nav>
    </div>
  );
};

export default Home;
