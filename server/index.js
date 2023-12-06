const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();
const mysql = require('mysql2');
//npm run devStart

const jwt = require('jsonwebtoken');

// Create a MySQL pool
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'DBDropPassword', // Replace with your actual MySQL password
    database: 'dbvaii',
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/api/insertUser', (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    // Check if email or username already exists
    const sqlCheck = "SELECT * FROM user_inf WHERE email = ? OR username = ?";
    db.query(sqlCheck, [email, username], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: "Internal Server Error" });
        } else {
            // If result array is not empty, email or username already exists
            if (result.length > 0) {
                res.status(400).json({ message: "Email or username already exists" });
            } else {
                // If result array is empty, insert new record
                const sqlInsert = "INSERT INTO user_inf (username, email, password, role) VALUES (?, ?, ?, 0);";
                db.query(sqlInsert, [username, email, password], (err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({ message: "Internal Server Error" });
                    } else {
                        console.log(result);
                        res.status(200).json({ message: "User inserted successfully" });
                    }
                });
            }
        }
    });
});
const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"];
    if (!token) {
      res.status(401).json({ auth: false, message: "Token not provided" });
    } else {
      jwt.verify(token, "jwSecret", (err, decoded) => {
        if (err) {
          res.status(401).json({ auth: false, message: "Failed to authenticate token" });
        } else {
          req.userId = decoded.id;
          next();
        }
      });
    }
  };

app.get('/api/isUserAuth', verifyJWT, (req, res)=>{
    res.send("User is authenticated")
})

app.post('/api/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // SQL query to check if the provided username and password match
    const sqlLogin = "SELECT * FROM user_inf WHERE username = ? AND password = ?";
    db.query(sqlLogin, [username, password], (err, result) => {
    if (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    } else {
        if (result.length > 0) {
            const id = result[0].user_id;
            const token = jwt.sign({ id }, "jwSecret", { expiresIn: 300 });
            res.json({ auth: true, token: token, user: result[0] });
        } else {
            res.json({ auth: false, message: "Invalid username or password" });
        }
    }
    });
});


app.get('/api/products', (req, res) => {
    const sqlSelect = "SELECT * FROM products";
    db.query(sqlSelect, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: "Internal Server Error" });
        } else {
            //res.status(200).json(result);
            res.send(result);
        }
    });
});

app.post('/api/addToCart', verifyJWT, (req, res) => {
    const user_id = req.userId;
    const product_id = req.body.product_id;
    const quantity = req.body.quantity;
  
    // Check if the combination of user_id and product_id already exists in the cart
    const checkIfExistsQuery = 'SELECT * FROM cart WHERE user_id = ? AND product_id = ?';
    db.query(checkIfExistsQuery, [user_id, product_id], (checkErr, checkResult) => {
      if (checkErr) {
        console.error('Error checking if product exists in cart:', checkErr);
        res.status(500).json({ message: 'Internal Server Error' });
      } else {
        if (checkResult.length > 0) {
          // If the combination exists, update the quantity
          const existingQuantity = checkResult[0].quantity;
          const newQuantity = existingQuantity + quantity;
  
          const updateQuantityQuery = 'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?';
          db.query(updateQuantityQuery, [newQuantity, user_id, product_id], (updateErr, updateResult) => {
            if (updateErr) {
              console.error('Error updating quantity in cart:', updateErr);
              res.status(500).json({ message: 'Internal Server Error' });
            } else {
              console.log('Quantity updated successfully:', updateResult);
              res.status(200).json({ message: 'Quantity updated successfully', result: updateResult });
            }
          });
        } else {
          // If the combination doesn't exist, insert a new row
          const insertQuery = 'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)';
          db.query(insertQuery, [user_id, product_id, quantity], (insertErr, insertResult) => {
            if (insertErr) {
              console.error('Error inserting into cart:', insertErr);
              res.status(500).json({ message: 'Internal Server Error' });
            } else {
              console.log('Insert result:', insertResult);
              res.status(200).json({ message: 'Product added to cart successfully', result: insertResult });
            }
          });
        }
      }
    });
  });
  app.get('/api/getCartItems', (req, res) => {
    const user_id = req.query.user_id; // Use req.query to get the user_id from the query parameters
  
    // SQL query to get the cart items for the specified user_id
    const sqlGetCart = 'SELECT * FROM cart WHERE user_id = ?';
    db.query(sqlGetCart, [user_id], (err, result) => {
      if (err) {
        console.error('Error fetching cart items:', err);
        res.status(500).json({ message: 'Internal Server Error' });
      } else {
        res.send(result);
      }
    });
  });

  app.get('/api/getProductDetails/:id', (req, res) => {
    const product_id = req.params.id;
  
    const sqlGetProductDetails = 'SELECT * FROM products WHERE product_id = ?';
    db.query(sqlGetProductDetails, [product_id], (err, result) => {
      if (err) {
        console.error('Error fetching product details:', err);
        res.status(500).json({ message: 'Internal Server Error' });
      } else {
        res.status(200).json(result[0]); // Assuming there is only one product with the given ID
      }
    });
  });
  app.post('/api/updateCartItemQuantity', (req, res) => {
    const user_id = req.body.user_id; // Assuming you send user_id from the client
    const product_id = req.body.product_id;
    const amount = req.body.amount; // This can be +1 or -1
  
    // Check if the cart item exists for the given user and product
    const sqlCheckCartItem = 'SELECT * FROM cart WHERE user_id = ? AND product_id = ?';
    db.query(sqlCheckCartItem, [user_id, product_id], (err, result) => {
      if (err) {
        console.error('Error checking cart item:', err);
        res.status(500).json({ message: 'Internal Server Error' });
      } else {
        if (result.length === 0) {
          // Cart item doesn't exist, insert a new row
          const sqlInsert = 'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)';
          db.query(sqlInsert, [user_id, product_id, amount], (err, result) => {
            if (err) {
              console.error('Error inserting into cart:', err);
              res.status(500).json({ message: 'Internal Server Error' });
            } else {
              res.status(200).json({ message: 'Cart item updated successfully', result });
            }
          });
        } else {
          // Cart item exists, update the quantity
          const currentQuantity = result[0].quantity;
          const newQuantity = Math.max(0, currentQuantity + amount); // Ensure the quantity is non-negative
  
          const sqlUpdate = 'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?';
          db.query(sqlUpdate, [newQuantity, user_id, product_id], (err, result) => {
            if (err) {
              console.error('Error updating cart item:', err);
              res.status(500).json({ message: 'Internal Server Error' });
            } else {
              res.status(200).json({ message: 'Cart item updated successfully', result });
            }
          });
        }
      }
    });
  });
      
  app.post('/api/updateUsername', (req, res) => {
    const user_id = req.body.user_id; 
    const username = req.body.username;
    const sqlUpdate = 'UPDATE user_inf SET username = ? WHERE user_id = ?';
    db.query(sqlUpdate, [username, user_id], (err, result) => {
      if (err) {
        console.error('Error updating username:', err);
        res.status(500).json({ message: 'Internal Server Error' });
      } else {
        res.status(200).json({ message: 'Username updated successfully', result });
      }
    });
  });
  
  app.post('/api/updateEmail', (req, res) => {
    const user_id = req.body.user_id;
    const email = req.body.email;
    const sqlUpdate = 'UPDATE user_inf SET email = ? WHERE user_id = ?';
    db.query(sqlUpdate, [email, user_id], (err, result) => {
      if (err) {
        console.error('Error updating email:', err);
        res.status(500).json({ message: 'Internal Server Error' });
      } else {
        res.status(200).json({ message: 'Email updated successfully', result });
      }
    });
  });
  
  app.post('/api/updatePassword', (req, res) => {
    const user_id = req.body.user_id;
    const password = req.body.password;
    const sqlUpdate = 'UPDATE user_inf SET password = ? WHERE user_id = ?';
    db.query(sqlUpdate, [password, user_id], (err, result) => {
      if (err) {
        console.error('Error updating password:', err);
        res.status(500).json({ message: 'Internal Server Error' });
      } else {
        res.status(200).json({ message: 'Password updated successfully', result });
      }
    });
  });
  app.post('/api/getrole', (req, res)  => {	
    const user_id = req.body.user_id;
    const sqlSelect = "SELECT role FROM user_inf WHERE user_id = ?";
    db.query(sqlSelect, [user_id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: "Internal Server Error" });
        } else {
            //res.status(200).json(result);
            res.send(result);
        }
    });
  }
  );
  app.post('/api/deleteAccount', (req, res) => {
    const user_id = req.body.user_id;

    // Delete from the order table
    const sqlDeleteOrders = "DELETE FROM `orders` WHERE user_id = ?";
    db.query(sqlDeleteOrders, [user_id], (errOrders, resultOrders) => {
        if (errOrders) {
            console.log(errOrders);
            res.status(500).json({ message: "Error deleting orders" });
        } else {
            // Delete from the cart table
            const sqlDeleteCart = "DELETE FROM cart WHERE user_id = ?";
            db.query(sqlDeleteCart, [user_id], (errCart, resultCart) => {
                if (errCart) {
                    console.log(errCart);
                    res.status(500).json({ message: "Error deleting cart items" });
                } else {
                    // Delete from the user_inf table
                    const sqlDeleteUser = "DELETE FROM user_inf WHERE user_id = ?";
                    db.query(sqlDeleteUser, [user_id], (errUser, resultUser) => {
                        if (errUser) {
                            console.log(errUser);
                            res.status(500).json({ message: "Error deleting user" });
                        } else {
                            res.status(200).json({ message: "User deleted successfully" });
                        }
                    });
                }
            });
        }
    });
});



app.listen(3001, () => {
    console.log("Running on port 3001");
});
