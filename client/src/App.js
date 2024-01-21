import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import CustomNavbar from "./components/CustomNavbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Cart from "./components/Cart";
import Profile from "./components/Profile";
import PayPall from "./components/PayPall";
import Orders from "./components/Orders";
import Users from "./components/Users";
import { AuthProvider, useAuth } from "react-auth-verification-context";

function App() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
  };
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <CustomNavbar onSearch={handleSearch} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/Cart" element={<Cart />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/PayPall" element={<PayPall />} />
            <Route path="/Orders" element={<Orders />} />
            <Route path="/Users" element={<Users />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
