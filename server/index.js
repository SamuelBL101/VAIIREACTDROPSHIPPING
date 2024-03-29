const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const multer = require("multer");
const sharp = require("sharp");

//npm run devStart

const jwt = require("jsonwebtoken");

// Create a MySQL pool
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "DBDropPassword",
  database: "dbvaii",
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
const storage = multer.memoryStorage(); // Store files in memory (you can adjust this based on your requirements)
const upload = multer({ storage: storage });

app.post("/api/insertUser", async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  let password = req.body.password;

  // Check if email or username already exists
  const sqlCheck = "SELECT * FROM user_inf WHERE email = ? OR username = ?";
  db.query(sqlCheck, [email, username], async (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      // If result array is not empty, email or username already exists
      if (result.length > 0) {
        res.status(400).json({ message: "Email or username already exists" });
      } else {
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        console.log("Hashed password:", this.password);

        // If result array is empty, insert new record
        const sqlInsert =
          "INSERT INTO user_inf (username, email, password, role) VALUES (?, ?, ?, 0);";
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
        res
          .status(401)
          .json({ auth: false, message: "Failed to authenticate token" });
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  }
};

app.get("/api/isUserAuth", verifyJWT, (req, res) => {
  res.send("User is authenticated");
});

app.post("/api/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // SQL query to check if the provided username exists
  const sqlCheckUser = "SELECT * FROM user_inf WHERE username = ?";
  db.query(sqlCheckUser, [username], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      if (result.length > 0) {
        const hashedPassword = result[0].password;

        // Compare the provided password with the stored hashed password
        bcrypt.compare(password, hashedPassword, (bcryptErr, bcryptResult) => {
          if (bcryptErr) {
            console.error("Error comparing passwords:", bcryptErr);
            res.status(500).json({ message: "Internal Server Error" });
          } else {
            if (bcryptResult) {
              // Passwords match, generate a JWT token or perform other actions
              const id = result[0].user_id;
              const token = jwt.sign({ id }, "jwSecret", { expiresIn: 300 });
              res.json({ auth: true, token: token, user: result[0] });
            } else {
              // Passwords do not match
              res.json({
                auth: false,
                message: "Invalid username or password",
              });
            }
          }
        });
      } else {
        // User with the provided username does not exist
        res.json({ auth: false, message: "Invalid username or password" });
      }
    }
  });
});

app.get("/api/products", (req, res) => {
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

app.post("/api/addToCart", verifyJWT, (req, res) => {
  const user_id = req.userId;
  const product_id = req.body.product_id;
  const quantity = req.body.quantity;

  // Check if the combination of user_id and product_id already exists in the cart
  const checkIfExistsQuery =
    "SELECT * FROM cart WHERE user_id = ? AND product_id = ?";
  db.query(
    checkIfExistsQuery,
    [user_id, product_id],
    (checkErr, checkResult) => {
      if (checkErr) {
        console.error("Error checking if product exists in cart:", checkErr);
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        if (checkResult.length > 0) {
          // If the combination exists, update the quantity
          const existingQuantity = checkResult[0].quantity;
          const newQuantity = existingQuantity + quantity;

          const updateQuantityQuery =
            "UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?";
          db.query(
            updateQuantityQuery,
            [newQuantity, user_id, product_id],
            (updateErr, updateResult) => {
              if (updateErr) {
                console.error("Error updating quantity in cart:", updateErr);
                res.status(500).json({ message: "Internal Server Error" });
              } else {
                console.log("Quantity updated successfully:", updateResult);
                res.status(200).json({
                  message: "Quantity updated successfully",
                  result: updateResult,
                });
              }
            }
          );
        } else {
          // If the combination doesn't exist, insert a new row
          const insertQuery =
            "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)";
          db.query(
            insertQuery,
            [user_id, product_id, quantity],
            (insertErr, insertResult) => {
              if (insertErr) {
                console.error("Error inserting into cart:", insertErr);
                res.status(500).json({ message: "Internal Server Error" });
              } else {
                console.log("Insert result:", insertResult);
                res.status(200).json({
                  message: "Product added to cart successfully",
                  result: insertResult,
                });
              }
            }
          );
        }
      }
    }
  );
});
app.get("/api/getCartItems", (req, res) => {
  const user_id = req.query.user_id;

  // SQL query to get the cart items for the specified user_id
  const sqlGetCart = "SELECT * FROM cart WHERE user_id = ?";
  db.query(sqlGetCart, [user_id], (err, result) => {
    if (err) {
      console.error("Error fetching cart items:", err);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      res.send(result);
    }
  });
});
//* Get product details
app.get("/api/getProductDetails/:id", (req, res) => {
  const product_id = req.params.id;

  const sqlGetProductDetails = "SELECT * FROM products WHERE product_id = ?";
  db.query(sqlGetProductDetails, [product_id], (err, result) => {
    if (err) {
      console.error("Error fetching product details:", err);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      res.status(200).json(result[0]); // Assuming there is only one product with the given ID
    }
  });
});
//* Update cart items
app.post("/api/updateCartItemQuantity", (req, res) => {
  const user_id = req.body.user_id; // Assuming you send user_id from the client
  const product_id = req.body.product_id;
  const amount = req.body.amount; // This can be +1 or -1

  // Check if the cart item exists for the given user and product
  const sqlCheckCartItem =
    "SELECT * FROM cart WHERE user_id = ? AND product_id = ?";
  db.query(sqlCheckCartItem, [user_id, product_id], (err, result) => {
    if (err) {
      console.error("Error checking cart item:", err);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      if (result.length === 0) {
        // Cart item doesn't exist, insert a new row
        const sqlInsert =
          "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)";
        db.query(sqlInsert, [user_id, product_id, amount], (err, result) => {
          if (err) {
            console.error("Error inserting into cart:", err);
            res.status(500).json({ message: "Internal Server Error" });
          } else {
            res
              .status(200)
              .json({ message: "Cart item updated successfully", result });
          }
        });
      } else {
        // Cart item exists, update the quantity
        const currentQuantity = result[0].quantity;
        const newQuantity = Math.max(0, currentQuantity + amount); // Ensure the quantity is non-negative

        const sqlUpdate =
          "UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?";
        db.query(
          sqlUpdate,
          [newQuantity, user_id, product_id],
          (err, result) => {
            if (err) {
              console.error("Error updating cart item:", err);
              res.status(500).json({ message: "Internal Server Error" });
            } else {
              res
                .status(200)
                .json({ message: "Cart item updated successfully", result });
            }
          }
        );
      }
    }
  });
});
// Update UserName
app.post("/api/updateUsername", (req, res) => {
  const user_id = req.body.user_id;
  const username = req.body.username;
  const sqlUpdate = "UPDATE user_inf SET username = ? WHERE user_id = ?";
  db.query(sqlUpdate, [username, user_id], (err, result) => {
    if (err) {
      console.error("Error updating username:", err);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      res
        .status(200)
        .json({ message: "Username updated successfully", result });
    }
  });
});
//Update Email
app.post("/api/updateEmail", (req, res) => {
  const user_id = req.body.user_id;
  const email = req.body.email;
  const sqlUpdate = "UPDATE user_inf SET email = ? WHERE user_id = ?";
  db.query(sqlUpdate, [email, user_id], (err, result) => {
    if (err) {
      console.error("Error updating email:", err);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      res.status(200).json({ message: "Email updated successfully", result });
    }
  });
});

app.post("/api/updatePassword", async (req, res) => {
  const user_id = req.body.user_id;
  const plainPassword = req.body.password;

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    const sqlUpdate = "UPDATE user_inf SET password = ? WHERE user_id = ?";
    db.query(sqlUpdate, [hashedPassword, user_id], (err, result) => {
      if (err) {
        console.error("Error updating password:", err);
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        res
          .status(200)
          .json({ message: "Password updated successfully", result });
      }
    });
  } catch (error) {
    console.error("Error hashing password:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.post("/api/getrole", (req, res) => {
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
});
app.post("/api/deleteAccount", (req, res) => {
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

app.post("/api/createOrder", (req, res) => {
  const {
    user_id,
    orderdate,
    address_line1,
    admin_area2,
    admin_area1,
    postal_code,
    country_code,
    total_cost,
  } = req.body;
  console.log("Order details:", req.body);
  console.log("Order date:", orderdate);
  const formattedOrderDate = new Date(orderdate);
  // SQL query to insert an order into the 'orders' table
  const insertOrderQuery = `INSERT INTO orders (user_id, orderdate, address_line1, admin_area2, admin_area1, postal_code, country_code, total_cost) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(
    insertOrderQuery,
    [
      user_id,
      formattedOrderDate,
      address_line1,
      admin_area2,
      admin_area1,
      postal_code,
      country_code,
      total_cost,
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting order:", err);
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        const order_id = result.insertId;
        res.json({ order_id, message: "Order created successfully" });
      }
    }
  );
});

app.post("/api/createOrderDetails", (req, res) => {
  const { order_id, product_id, quantity } = req.body;

  // SQL query to insert order details into the 'order_details' table
  const insertOrderDetailsQuery = `INSERT INTO order_details (order_detail_id, product_id, quantity) VALUES (?, ?, ?)`;

  db.query(
    insertOrderDetailsQuery,
    [order_id, product_id, quantity],
    (err, result) => {
      if (err) {
        console.error("Error inserting order details:", err);
        res.status(500).json({ message: "Internal Server Error" });
      } else {
        const orderDetailId = result.insertId;
        res.json({
          order_detail_id: orderDetailId,
          message: "Order details created successfully",
        });
      }
    }
  );
});

app.post("/api/removeCartItems", (req, res) => {
  const user_id = req.body.user_id;

  // SQL query to delete cart items for the specified user_id
  const sqlDeleteCartItems = "DELETE FROM cart WHERE user_id = ?";
  db.query(sqlDeleteCartItems, [user_id], (err, result) => {
    if (err) {
      console.error("Error deleting cart items:", err);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      res.json({ message: "Cart items deleted successfully" });
    }
  });
});

app.post("/api/deleteOrder", (req, res) => {
  const order_id = req.body.order_id;

  // SQL query to delete an order from the 'orders' table
  const sqlDeleteOrder = "DELETE FROM orders WHERE order_id = ?";
  db.query(sqlDeleteOrder, [order_id], (err, result) => {
    if (err) {
      console.error("Error deleting order:", err);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      res.json({ message: "Order deleted successfully" });
    }
  });
});
/*
app.post("/api/deleteOrderDetails", (req, res) => {
  const order_id = req.body.order_id;

  // SQL query to delete order details from the 'order_details' table
  const sqlDeleteOrderDetails = "DELETE FROM order_details WHERE order_id = ?";
  db.query(sqlDeleteOrderDetails, [order_id], (err, result) => {
    if (err) {
      console.error("Error deleting order details:", err);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      res.json({ message: "Order details deleted successfully" });
    }
  });
});
*/
/*
app.delete("/api/deleteOrder/:id", (req, res) => {
  const orderId = parseInt(req.params.id);

  // Find the index of the order with the specified ID
  const orderIndex = orders.findIndex((order) => order.order_id === orderId);

  if (orderIndex !== -1) {
    // Remove the order from the array
    orders.splice(orderIndex, 1);

    // Respond with success
    res.json({ message: "Order deleted successfully" });
  } else {
    // Respond with an error if the order is not found
    res.status(404).json({ error: "Order not found" });
  }
});
*/
app.delete("/api/deleteOrder/:id", (req, res) => {
  const orderId = parseInt(req.params.id);

  // SQL query to delete an order from the 'orders' table
  const sqlDeleteOrder = "DELETE FROM orders WHERE order_id = ?";
  db.query(sqlDeleteOrder, [orderId], (err, result) => {
    if (err) {
      console.error("Error deleting order:", err);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      res.json({ message: "Order deleted successfully" });
    }
  });
});

app.get("/api/getOrders", (req, res) => {
  const sql = "SELECT * FROM orders";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching orders:", err);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      res.send(result);
    }
  });
});

app.get("/api/getUsers", (req, res) => {
  const sql = "SELECT * FROM user_inf";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      res.send(result);
    }
  });
});

app.delete("/api/deleteUser/:id", (req, res) => {
  const userId = parseInt(req.params.id);

  // SQL query to delete a user from the 'user_inf' table
  const sqlDeleteUser = "DELETE FROM user_inf WHERE user_id = ?";
  db.query(sqlDeleteUser, [userId], (err, result) => {
    if (err) {
      console.error("Error deleting user:", err);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      res.json({ message: "User deleted successfully" });
    }
  });
});
app.post("/api/changeRole/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const newRole = req.body.role;

  // SQL query to update the role of a user in the 'user_inf' table
  const sqlUpdateRole = "UPDATE user_inf SET role = ? WHERE user_id = ?";

  db.query(sqlUpdateRole, [newRole, userId], (err, result) => {
    if (err) {
      console.error("Error updating user role:", err);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      res.json({ message: "User role updated successfully", newRole });
    }
  });
});

app.post("/api/updateProfileImage", upload.single("file"), async (req, res) => {
  try {
    const user_id = req.body.user_id;
    const imageBuffer = req.file.buffer;

    // Use sharp to resize and compress the image
    const compressedImageBuffer = await sharp(imageBuffer)
      .resize({ width: 256 }) // Set the desired width
      .toBuffer();

    // Further check on the compressed size
    if (compressedImageBuffer.length < 65535) {
      console.log("Compressed image size is within the allowed limit.");

      // Update profile image in the database
      const sqlUpdateImage =
        "UPDATE user_inf SET profile_picture = ? WHERE user_id = ?";
      db.query(
        sqlUpdateImage,
        [compressedImageBuffer, user_id],
        (err, result) => {
          if (err) {
            console.error("Error updating profile image in the database:", err);
            res.status(500).json({ message: "Internal Server Error" });
          } else {
            res.writeHead(200, {
              "Content-Type": "image/jpeg",
              "Content-Length": compressedImageBuffer.length,
            });
            res.end(compressedImageBuffer, "binary");
          }
        }
      );
    } else {
      console.log("Compressed image size exceeds the allowed limit.");
      res.status(400).json({ message: "Image size exceeds the allowed limit" });
    }
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(400).json({ message: "Bad Request" });
  }
});

app.get("/api/getProfileImage/:id", (req, res) => {
  const user_id = req.params.id;

  // SQL query to get the profile image for the specified user_id
  const sqlGetImage = "SELECT profile_picture FROM user_inf WHERE user_id = ?";
  db.query(sqlGetImage, [user_id], (err, result) => {
    if (err) {
      console.error("Error fetching profile image:", err);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      // Check if the result has data
      if (result[0] && result[0].profile_picture) {
        const imageBuffer = result[0].profile_picture;
        res.writeHead(200, {
          "Content-Type": "image/jpeg",
          "Content-Length": imageBuffer.length,
        });
        res.end(imageBuffer, "binary");
      } else {
        res.status(404).json({ message: "Profile image not found" });
      }
    }
  });
});

app.listen(3001, () => {
  console.log("Running on port 3001");
});
