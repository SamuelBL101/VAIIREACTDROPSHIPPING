import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useAuth } from 'react-auth-verification-context';
import styles from '../css/cart.module.css';

// Create a new CartItem component
const CartItem = ({ item }) => {
  const [productDetails, setProductDetails] = useState(null);
  const { isAuthenticated, attributes } = useAuth();

  useEffect(() => {
    Axios.get(`http://localhost:3001/api/getProductDetails/${item.product_id}`)
      .then((response) => {
        setProductDetails(response.data);
      })
      .catch((error) => {
        console.error('Error fetching product details:', error);
      });
  }, [item.product_id]);

  const handleQuantityChange = (amount) => {
    Axios.post(
      'http://localhost:3001/api/updateCartItemQuantity',
      {
        user_id: attributes.id,
        product_id: item.product_id,
        amount: amount,
      },
    )
      .then((response) => {
        console.log(response.data.message); // Handle success
        // Fetch the updated cart items after a successful update
        Axios.get('http://localhost:3001/api/getCartItems', {
          params: {
            user_id: attributes.id,
          },
        })
          .then((response) => {
            // Update the local state with the new cart items
            setProductDetails(response.data);
          })
          .catch((error) => {
            console.error('Error fetching cart items:', error);
          });
      })
      .catch((error) => {
        console.error('Error updating cart item:', error); // Handle error
      });
  };

  if (!productDetails) {
    return <p>Loading product details!...</p>;
  }

  return (
    <div className={styles['cart-item']}>
      <div className={styles['cart-item-image-container']}>
        <img src={productDetails.imgSrc} alt={productDetails.product_name} className={styles['cart-item-image']} />
      </div>
      <div className={styles['cart-item-details']}>
        <p>{productDetails.product_name}</p>
        <p>Quantity: {item.quantity}</p>
        <button onClick={() => handleQuantityChange(1)}>+1</button>
        <button onClick={() => handleQuantityChange(-1)}>-1</button>
        <p>Price: ${productDetails.price}</p>
      </div>
    </div>
  );
};

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, attributes } = useAuth();

  useEffect(() => {
    console.log('Fetching cart items for user ID:', attributes.id);

    Axios.get('http://localhost:3001/api/getCartItems', {
      params: {
        user_id: attributes.id,
      },
    })
      .then((response) => {
        console.log('Cart Items:', response.data);
        setCartItems(response.data);
        const total = response.data.reduce((acc, item) => acc + item.quantity, 0);
        setTotalQuantity(total);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching cart items:', error);
      });
  }, [attributes.id]);

  if (!isAuthenticated) {
    return (
      <div>
        <h1>You must log in to access the cart</h1>
      </div>
    );
  }

  return (
    <div className={styles['cart-container']}>
      <div className={styles['cart-items']}>
        <h2>Your Cart</h2>
        {loading ? (
          <p>Loading cart items...</p>
        ) : (
          cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))
        )}
      </div>
      <div className={styles['cart-summary']}>
        <h2>Order Summary</h2>
        <p>Total Quantity: {totalQuantity}</p>
      </div>
    </div>
  );
};

export default Cart;
