import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./routes";
import "./styles/index.css"; // Asegúrate de tener un archivo CSS para estilos globales

ReactDOM.createRoot(document.getElementById("root")).render(
  <div className="mobile-container">
    <AppRoutes />
  </div>
);
