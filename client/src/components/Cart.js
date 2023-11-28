import React, { useState ,useEffect} from 'react';
import Axios from "axios";


const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Fetch cart items from the server when the component mounts
    Axios.get('http://localhost:3001/api/getCartItems')
      .then((response) => {
        setCartItems(response.data);
      })
      .catch((error) => {
        console.error('Error fetching cart items:', error);
      });
  }, []);
  return (
    <div>
      <h2>Stránka nákupního košíku</h2>
       {/* Render the cart items */}
      {cartItems.map((item) => (
      <div key={item.id}>
        <p>{item.title}</p>
        {/* Render other item details */}
      </div>
    ))}
  </div>
);
};

export default Cart;