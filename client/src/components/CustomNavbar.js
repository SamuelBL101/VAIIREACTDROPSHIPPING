// Importing necessary modules from React
import React from "react";
import { Link } from "react-router-dom";
import "../css/CustomNavbar.css"; // Import styles for navbar
import { useAuth } from 'react-auth-verification-context'; // Import useAuth
import { NavDropdown } from 'react-bootstrap';
import { DropdownItem as MenuItem } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import styles for bootstrap

// Component for navigation panel
const CustomNavbar = () => {
  const { isAuthenticated, attributes, logout } = useAuth(); // Include logout in the destructuring

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          SalesCounter
        </Link>

        {/* Search field */}
        <div className="navbar-search">
          <input type="text" placeholder="Vyhľadať" />
          <button type="submit">Hľadať</button>
        </div>

        {/* Navigation links */}
        <div className="navbar-links">
          <Link to="/" className="navbar-link">
            Domov
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/Profile" className="navbar-link">
                Profil
              </Link>
              {attributes.role === 1 && (
                <NavDropdown title="Admin" id="basic-nav-dropdown">
                  <MenuItem href="/Admin">Admin</MenuItem>
                  <MenuItem href="/Admin/Products">Products</MenuItem>
                  <MenuItem href="/Admin/Users">Users</MenuItem>
                </NavDropdown>
              )}
              <Link to="/Cart" className="navbar-link">
                Košík
              </Link>
              <Link to="/" className="navbar-link" onClick={handleLogout}>
                Odhlásiť sa
              </Link>
            </>
          ) : (
            <>
              <Link to="/Login" className="navbar-link">
                Prihlásenie
              </Link>
              <Link to="/Register" className="navbar-link">
                Registrovať
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default CustomNavbar;