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
            // If result array is not empty, username and password are correct
            if (result.length > 0) {
                // Create a JWT token
                const id = result[0].id;
                const token = jwt.sign({ id }, "jwSecret", {
                    expiresIn: 300,
                });
                // Send the JWT token to the client
                res.json({ auth: true, token: token, result: result });
            } else {
                // If result array is empty, username or password is incorrect
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

    const sqlInsert = 'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)';
    db.query(sqlInsert, [user_id, product_id, quantity], (err, result) => {
        if (err) {
            console.error('Error inserting into cart:', err);
            res.status(500).json({ message: 'Internal Server Error' });
          } else {
            console.log('Insert result:', result);
            res.status(200).json({ message: 'Product added to cart successfully', result });
          }
    });
  });


app.listen(3001, () => {
    console.log("Running on port 3001");
});
