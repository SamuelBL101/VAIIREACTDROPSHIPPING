// Home.tsx
import React, { useState } from "react";
import ProductList from "./ProductList.js"; // Importovaný súbor pre zoznam produktov
import CategoryList from "./CategoryList.js"; // Importovaný súbor pre zoznam kategórií

const Home = () => {
  const [cart, setCart] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const addToCart = (product) => {
    setCart([...cart, product]);
  };
  const handleSearch = () => {
    // Implement logic to update state or trigger callback to filter products
    // For example, you can set the search string in the state and pass it to ProductList
    // Or directly trigger a filter function in ProductList
  };
  return (
    <div>
      <div id="content-container">
        <div id="search-bar">
          <div id="find-product">
            <input
              type="text"
              placeholder="Vyhľadať"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="search-input"
            />
            <br />
            <button type="submit" className="add-to-cart-button">
              Hľadať
            </button>
          </div>
          <nav id="sidebar-categories">
            <CategoryList />
          </nav>
        </div>
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <h2>Domovská stránka</h2>
          <ProductList addToCart={addToCart} searchInput={searchInput} />
        </main>
      </div>
    </div>
  );
};

export default Home;
