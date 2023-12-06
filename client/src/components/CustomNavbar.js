// Importovanie potrebných modulov z Reactu
import React from "react";
import { Link } from "react-router-dom";
import "../css/CustomNavbar.css"; // Import štýlov pre navbar
import { useAuth } from 'react-auth-verification-context'; // Import useAuth
import { NavDropdown } from 'react-bootstrap';
import { DropdownItem as MenuItem } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import štýlov pre bootstrap


// Komponenta pre navigačný panel
const CustomNavbar = () => {
  const { isAuthenticated, attributes, logout } = useAuth(); // Include logout in the destructuring

  const handleLogout = () => {
    // Call the logout function from useAuth
    logout();
  };

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
    <>
      <Link to="/Profile" className="navbar-link">
        Profile
      </Link>
      {attributes.role === 1 && (
        <NavDropdown title="Admin" id="basic-nav-dropdown">
          <MenuItem href="/Admin">Admin</MenuItem>
          <MenuItem href="/Admin/Products">Products</MenuItem>
          <MenuItem href="/Admin/Users">Users</MenuItem>
        </NavDropdown>
      )}
      <Link to="/Cart" className="navbar-link">
        Cart
      </Link>
      <Link to="/" className="navbar-link" onClick={handleLogout}>
        Logout
      </Link>
    </>
  ) : (
    <>
      <Link to="/Login" className="navbar-link">
        Login
      </Link>
      <Link to="/Register" className="navbar-link">
        Register
      </Link>
    </>
  )}
</div>

      </div>
    </nav>
  );
};

export default CustomNavbar;