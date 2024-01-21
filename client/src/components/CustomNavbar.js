// Importing necessary modules from React
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/CustomNavbar.css"; // Import styles for navbar
import { useAuth } from "react-auth-verification-context"; // Import useAuth
import { NavDropdown } from "react-bootstrap";
import { DropdownItem as MenuItem } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Import styles for bootstrap

// Component for navigation panel
const CustomNavbar = () => {
  const { isAuthenticated, attributes, logout } = useAuth(); // Include logout in the destructuring
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };
  const orderClicked = () => {
    navigate("/Orders");
  };
  const usersClicked = () => {
    navigate("/Users");
  };

  return (
    <nav className="navbar">
      <div className="container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          SalesCounter
        </Link>

        {/* Search field 
        <div className="navbar-search">
          <input type="text" placeholder="Vyhľadať" />
          <button type="submit">Hľadať</button>
        </div>
*/}
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
                  <MenuItem onClick={orderClicked}>Objednávky</MenuItem>
                  <MenuItem onClick={usersClicked}>Používatelia</MenuItem>
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
