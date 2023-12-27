import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useAuth } from "react-auth-verification-context";
import styles from "../css/cart.module.css";
import PayPall from "./PayPall";

// Create a new CartItem component
const CartItem = ({ item, updateCartItems }) => {
  const [productDetails, setProductDetails] = useState(null);
  const { isAuthenticated, attributes } = useAuth();
  const [isLoading, setIsLoading] = useState(true); // Add this line

  useEffect(() => {
    Axios.get(`http://localhost:3001/api/getProductDetails/${item.product_id}`)
      .then((response) => {
        setProductDetails(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
      });
  }, [item.product_id]);

  const handleQuantityChange = (amount) => {
    Axios.post("http://localhost:3001/api/updateCartItemQuantity", {
      user_id: attributes.id,
      product_id: item.product_id,
      amount: amount,
    })
      .then((response) => {
        console.log(response.data.message); // Handle success
        // Fetch the updated cart items after a successful update
        Axios.get("http://localhost:3001/api/getCartItems", {
          params: {
            user_id: attributes.id,
          },
        })
          .then((response) => {
            // Update the local state with the new cart items
            //const updatedItem = response.data.find((cartItem) => cartItem.product_id === item.product_id);
            Axios.get(
              `http://localhost:3001/api/getProductDetails/${item.product_id}`
            )
              .then((response) => {
                // Update the local state with the new product details for the specific item
                setProductDetails(response.data);
              })
              .catch((error) => {
                console.error("Error fetching updated product details:", error);
              });
            updateCartItems(response.data);
          })
          .catch((error) => {
            console.error("Error fetching cart items:", error);
          });
      })
      .catch((error) => {
        console.error("Error updating cart item:", error); // Handle error
      });
  };

  if (isLoading) {
    return <p>Loading product details!...</p>;
  }

  return (
    <div className={styles["cart-item"]}>
      {productDetails && (
        <>
          <div className={styles["cart-item-image-container"]}>
            <img
              src={productDetails.imgSrc}
              alt={productDetails.product_name}
              className={styles["cart-item-image"]}
            />
          </div>
          <div className={styles["cart-item-details"]}>
            <p>{productDetails.product_name}</p>
            <p>Quantity: {item.quantity}</p>
            <button onClick={() => handleQuantityChange(1)}>+1</button>
            <button onClick={() => handleQuantityChange(-1)}>-1</button>
            <p>Price: ${productDetails.price}</p>
          </div>
        </>
      )}
    </div>
  );
};

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, attributes } = useAuth();
  const [totalCost, setTotalCost] = useState(0);
  const [showPayPal, setShowPayPal] = useState(false);

  useEffect(() => {
    console.log("Fetching cart items for user ID:", attributes.id);

    Axios.get("http://localhost:3001/api/getCartItems", {
      params: {
        user_id: attributes.id,
      },
    })
      .then((response) => {
        console.log("Cart Items:", response.data);
        setCartItems(response.data);
        const total = response.data.reduce(
          (acc, item) => acc + item.quantity,
          0
        );
        setTotalQuantity(total);
        setLoading(false);
        const promises = response.data.map((item) =>
          Axios.get(
            `http://localhost:3001/api/getProductDetails/${item.product_id}`
          )
        );
        Promise.all(promises)
          .then((responses) => {
            const totalCost = responses.reduce((acc, res, index) => {
              return acc + response.data[index].quantity * res.data.price;
            }, 0);
            setTotalCost(totalCost);
          })
          .catch((error) => {
            console.error("Error fetching product details:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
      });
  }, [attributes.id]);
  const calculateTotalCost = () => {
    const promises = cartItems.map((item) =>
      Axios.get(
        `http://localhost:3001/api/getProductDetails/${item.product_id}`
      )
    );
    Promise.all(promises)
      .then((responses) => {
        const totalCost = responses.reduce((acc, res, index) => {
          return acc + cartItems[index].quantity * res.data.price;
        }, 0);
        setTotalCost(totalCost);
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
      });
  };

  useEffect(() => {
    calculateTotalCost();
  }, [cartItems]);
  if (!isAuthenticated) {
    return (
      <div>
        <h1>You must log in to access the cart</h1>
      </div>
    );
  }

  const updateCartItems = (newCartItems) => {
    setCartItems(newCartItems);
    calculateTotalCost();
  };
  const handlePayment = () => {
    console.log("Payment button clicked");
    setShowPayPal(true);
  };

  const handlePaymentSuccess = (paypalOrder) => {
    console.log("Payment successful! PayPal Order details:", paypalOrder);

    const user_id = attributes.id; // Replace this with your logic to get the user ID

    // Extract relevant information from the PayPal order
    const address_line_1 =
      paypalOrder.purchase_units[0]?.shipping?.address?.address_line_1 || "";
    const admin_area_1 =
      paypalOrder.purchase_units[0]?.shipping?.address?.admin_area_1 || "";
    const admin_area_2 =
      paypalOrder.purchase_units[0]?.shipping?.address?.admin_area_2 || "";
    const country_code =
      paypalOrder.purchase_units[0]?.shipping?.address?.country_code || "";
    const postal_code =
      paypalOrder.purchase_units[0]?.shipping?.address?.postal_code || "";
    // Convert PayPal timestamp to a JavaScript Date object
    const orderdate = paypalOrder.create_time;

    // Calculate total cost based on purchase_units
    const total_cost = totalCost;

    Axios.post("http://localhost:3001/api/createOrder", {
      user_id,
      orderdate,
      address_line_1,
      admin_area_2,
      admin_area_1,
      postal_code,
      country_code,
      total_cost,
    })
      .then((response) => {
        const order_id = response.data.order_id;

        // Continue with other steps (e.g., creating order details) if needed...
      })
      .catch((error) => {
        console.error("Error creating order:", error);
      });
  };

  return (
    <div className={styles["cart-container"]}>
      <div className={styles["cart-items"]}>
        <h2>Your Cart</h2>
        {loading ? (
          <p>Loading cart items...</p>
        ) : (
          cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              updateCartItems={updateCartItems}
            />
          ))
        )}
      </div>
      <div className={styles["cart-summary"]}>
        <h2>Order Summary</h2>
        <p>Total Quantity: {totalQuantity}</p>
        <p>Total Cost: {totalCost.toFixed(2)}€</p>
        <button onClick={handlePayment}>Proceed to Payment</button>
        {showPayPal ? (
          <PayPall totalCost={totalCost} onSuccess={handlePaymentSuccess} />
        ) : (
          <p>Click the button to complete your payment.</p>
        )}
      </div>
    </div>
  );
};

export default Cart;
