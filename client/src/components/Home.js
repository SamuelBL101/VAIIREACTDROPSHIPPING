// Home.tsx
import React, { useState } from "react";
import ProductList from "./ProductList.js"; // Importovaný súbor pre zoznam produktov
import CategoryList from "./CategoryList.js"; // Importovaný súbor pre zoznam kategórií

const Home = () => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  return (
    <div>
      <div id="content-container">
        <nav id="sidebar-categories">
          <CategoryList />
        </nav>
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <h2>Domovská stránka</h2>
          {/* Ďalší obsah domovskej stránky */}
          <ProductList addToCart={addToCart} />
        </main>
      </div>
    </div>
  );
};

export default Home;
