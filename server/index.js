const express = require('express');
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

app.get("/", (req, res) => {
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

app.listen(3001, () => {
    console.log("Running on port 3001");
});
