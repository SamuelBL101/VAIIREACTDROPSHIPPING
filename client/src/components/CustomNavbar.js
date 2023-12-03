// Importovanie potrebných modulov z Reactu
import React from "react";
import { Link } from "react-router-dom";
import "../css/CustomNavbar.css"; // Import štýlov pre navbar
import { useAuth } from 'react-auth-verification-context'; // Import useAuth
import { NavDropdown, MenuItem } from 'react-bootstrap'; // Import bootstrap komponenty


// Komponenta pre navigačný panel
const CustomNavbar = () => {
  const { isAuthenticated, attributes } = useAuth(); // Use useAuth hook to get user information

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
          {isAuthenticated ? (
            <Link to="/Profile" className="navbar-link">
              Profile
            </Link>
          ) : (
            <Link to="/Login" className="navbar-link">
              Login
            </Link>
          )}
          <Link to="/Cart" className="navbar-link">
            Cart
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default CustomNavbar;