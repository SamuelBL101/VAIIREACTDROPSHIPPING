const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();
const mysql = require('mysql2');
//npm run devStart

// Create a MySQL pool
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'DBDropPassword', // Replace with your actual MySQL password
    database: 'dbvaii',
});

/*app.get("/", (req, res) => {
    // Sample data to insert
    const userData = {
        email: 'usfener@fgmaifl.com',
        password: 'heslicko',
        dateOfBirth: '2001-09-10', // Format date as 'YYYY-MM-DD'
    };

    // SQL query to insert data into the user_inf table
    const sqlInsert = "INSERT INTO user_inf (email, password, dateOfBirth) VALUES (?, ?, ?);";

    // Execute the query with user data
    db.query(sqlInsert, [userData.email, userData.password, userData.dateOfBirth], (err, result) => {
        if (err) {
            console.error("Error inserting into the database:", err);
            res.status(500).send("Internal Server Error");
        } else {
            console.log("Inserted into the database successfully");
            res.send("Data inserted into the database successfully");
        }
    });
});
*/
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/api/insert', (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    // Check if email or username already exists
    const sqlCheck = "SELECT * FROM user_inf WHERE email = ? OR username = ?";
    db.query(sqlCheck, [email, username], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
        } else {
            // If result array is not empty, email or username already exists
            if (result.length > 0) {
                res.status(400).send("Email or username already exists");
            } else {
                // If result array is empty, insert new record
                const sqlInsert = "INSERT INTO user_inf (username, email, password) VALUES (?, ?, ?);";
                db.query(sqlInsert, [username, email, password], (err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send("Internal Server Error");
                    } else {
                        console.log(result);
                        res.status(200).send("User inserted successfully");
                    }
                });
            }
        }
    });
});

app.listen(3001, () => {
    console.log("Running on port 3001");
});
