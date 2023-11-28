import React, { useEffect, useState } from 'react';
import '../css/style.css';
import Axios from "axios";

import { useContext } from 'react'; // Import useContext

const Product = ({ id, title, price, imgSrc }) => {

  const handleAddToCart = () => {
    // Assuming you have user_id available, replace 'user_id' with the actual user_id value
    const user_id = '5'; // Replace with your actual user_id
  
    Axios.post('http://localhost:3001/api/addToCart', {
      user_id,
      product_id: id,
      quantity: 1, // You may adjust the quantity as needed
    })
      .then((response) => {
        console.log(response.data); // Handle success
      })
      .catch((error) => {
        console.error('Error adding to cart:', error); // Handle error
      });
  };
  

  return (
    <div className="product">
      <img src={imgSrc} alt={title} className="product-image" />
      <h3>{title}</h3>
      <p>Cena: {price}</p>
      <button className="add-to-cart-button" onClick={handleAddToCart}>Pridať do košíka</button>
    </div>
  );
};

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    Axios.get('http://localhost:3001/api/products')
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  return (
    <div className="products">
      {products.map(product => (
        <Product
        key={product.product_id}
        id={product.product_id}
        title={product.product_name}
        price={product.price}
        imgSrc={product.imgSrc}
        />
      ))}
    </div>
    
  ); 
};

export default ProductList;
