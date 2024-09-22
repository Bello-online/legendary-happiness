// Write a simple Node.js program for an eCommerce applica&on using an SQLite database. 
// The applica&on should have four tables: client, product, order, and order_details. The program should expose REST API endpoints for basic CRUD opera&ons on each table, allowing users to:
// 2. Add, view, update, and remove products. 3. Place an order.
// 4. View details of an order.
// The table structures are as follows:


const sqlite3 = require("sqlite3").verbose();
const express = require('express');
const bodyParser = require('body-parser');

// Create the express App
const app = express();
app.use(bodyParser.json());
// Open database file 
const db = new sqlite3.Database("database.db");

// db Creation 
// Create tables 
db.serialize(() => {
    // - client table should store informa&on about the client (e.g., client ID, name, email).
    db.run(`CREATE TABLE client (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name TEXT NOT NULL,
        email TEXT NOT NULL
        )`);
    
    // - product table should store product informa&on (e.g., product ID, name, price, stock).
    db.run(`CREATE TABLE product (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name TEXT NOT NULL,
        price REAL NOT NULL,
        stock INTEGER NOT NULL
        )`);
        
    // - order table should store order informa&on (e.g., order ID, client ID, order date).
    db.run(`CREATE TABLE order_table (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        client_id INTEGER,
        order_date TEXT NOT NULL,
        FOREIGN KEY (client_id) REFERENCES client(id)
        )`);

    // - order_details table should store details of the products in an order (e.g., order ID, product ID, quan&ty).
        db.run(`CREATE TABLE order_details (
        order_id INTEGER,
        product_id INTEGER,
        quan&ty INTEGER NOT NULL,
        PRIMARY KEY (order_id, product_id),
        FOREIGN KEY (order_id) REFERENCES order_table(id), FOREIGN KEY (product_id) REFERENCES product(id)
        )`);
        });

        // 1. Create, read, update, and delete clients. 

        app.post('/clients', (req, res) => {
            const { name, email } = req.body;
            db.run(`INSERT INTO client (name, email) VALUES (?, ?)`, [name, email],function(err) {
            if (err) return res.status(500).send(err.message);
            res.send({ id: this.lastID }); });
            });












        // Start the server
        const PORT = 3000; app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`); });