// Importovanie potrebných modulov z Reactu
import React from "react";
import { BrowserRouter as Link } from "react-router-dom";
import "../css/CustomNavbar.css"; // Import štýlov pre navbar

// Komponenta pre navigačný panel
const CustomNavbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          SalesCounter
        </Link>
        {/* Vyhľadávacie pole */}
        <div className="navbar-search">
          <input type="text" placeholder="Vyhľadať" />
          <button type="submit">Hľadať</button>
        </div>

        {/* Navigačné odkazy */}
        <div className="navbar-links">
          <Link to="/" className="navbar-link">
            Home
          </Link>
          <Link to="/Login" className="navbar-link">
            User
          </Link>
          <Link to="/Cart" className="navbar-link">
            Cart
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default CustomNavbar;