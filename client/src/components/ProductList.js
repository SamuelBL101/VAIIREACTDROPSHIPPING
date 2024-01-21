import React, { useEffect, useState } from "react";
import "../css/style.css";
import Axios from "axios";
import { useAuth } from "react-auth-verification-context"; // Import useAuth
import { useContext } from "react"; // Import useContext

const Product = ({ id, title, price, imgSrc }) => {
  const { isAuthenticated, attributes } = useAuth(); // Use useAuth hook to get user information

  const handleAddToCart = () => {
    if (isAuthenticated) {
      Axios.post(
        "http://localhost:3001/api/addToCart",
        {
          product_id: id,
          quantity: 1,
          user_id: attributes.id, // Include user ID in the request payload
        },
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
        .then((response) => {
          console.log(response.data.message); // Handle success
        })
        .catch((error) => {
          console.error("Error adding to cart:", error); // Handle error
          console.log("Server Response:", error.response); // Log server response
        });
    } else {
      // Handle case where the user is not authenticated
      console.log("User is not authenticated. Please log in.");
    }
  };

  return (
    <div className="product">
      <img src={imgSrc} alt={title} className="product-image" />
      <h3>{title}</h3>
      <p>Cena: {price}€ </p>
      <button className="add-to-cart-button" onClick={handleAddToCart}>
        Pridať do košíka
      </button>
    </div>
  );
};

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:3001/api/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  return (
    <div className="products">
      {products.map((product) => (
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
