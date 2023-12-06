import React from 'react';
import styles from '../css/cart.module.css';


const CartItem = ({ product, onQuantityChange, onRemove }) => {
    if (!product) {
        // Handle the case when the product is null or undefined
        return null;
      }
  return (
    <div className={styles['cart-item-details']}>
      <p>{product.product_name}</p>
      <p>Quantity: {product.quantity}</p>
      <button onClick={() => onQuantityChange(product.product_id, 1)}>+1</button>
      <button onClick={() => onQuantityChange(product.product_id, -1)}>-1</button>
      <button onClick={() => onRemove(product.product_id)}>Remove</button>
    </div>
  );
};

export default CartItem;