import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import './App.css';
import CustomNavbar from "./components/CustomNavbar"; // Zmenený názov importovaného súboru
import Home from "./components/Home"
import Login from "./components/Login"
import Register from "./components/Register"
import Cart from "./components/Cart" 
function App() {
  return (
    <div className="App">
         <Router>
        <CustomNavbar />
        <Routes>
          {/* Používejte Route pro definování cest */}
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Cart" element={<Cart />} />
        </Routes>
      </Router>*/
    </div>
  );
}

export default App;
