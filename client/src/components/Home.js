// Home.tsx
import React from "react";
import ProductList from "./ProductList.js"; // Importovaný súbor pre zoznam produktov
import CategoryList from "./CategoryList.js"; // Importovaný súbor pre zoznam kategórií

const Home = () => {
  return (
    <div>
      <div id="content-container">
        <nav id="sidebar-categories">
          <CategoryList />
        </nav>
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <h2>Domovská stránka</h2>
          {/* Ďalší obsah domovskej stránky */}
          <ProductList />
        </main>
      </div>
    </div>
  );
};

export default Home;