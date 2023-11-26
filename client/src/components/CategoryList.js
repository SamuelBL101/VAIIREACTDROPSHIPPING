/*import React from "react"; 
import "../css/style.css"; 
const CategoryList = () =>
{ return (
<div className="category-list">
  <h2>Kategórie</h2>
  <ul>
    <li>
      <a href="#">Elektronika </a>
    </li>
    <li>
      <a href="#">Móda a oblečenie</a>
    </li>
    <li>
      <a href="#">Domácnosť a záhrada</a>
    </li>
    <li>
      <a href="#">Domácnosť a záhrada</a>
    </li>
    <li>
      <a href="#">Šport a outdoor</a>
    </li>
    <li>
      <a href="#"> Hračky a deti</a>
    </li>
    <li>
      <a href="#">Zvieratá a chovateľstvo</a>
    </li>
    {/* Pridajte ďalšie kategórie podľa potreby }
  </ul>
</div>
); }; export default CategoryList;*/
import React from "react"; 
import "../css/style.css"; 

const categories = [
  'Elektronika',
  'Móda a oblečenie',
  'Domácnosť a záhrada',
  'Šport a outdoor',
  'Hračky a deti',
  'Zvieratá a chovateľstvo'
];

const CategoryList = () => (
  <div className="category-list">
    <h2>Kategórie</h2>
    <ul>
      {categories.map((category, index) => (
        <li key={index}>
          <a href="#">{category}</a>
        </li>
      ))}
      {/* Pridajte ďalšie kategórie podľa potreby */}
    </ul>
  </div>
);

export default CategoryList;