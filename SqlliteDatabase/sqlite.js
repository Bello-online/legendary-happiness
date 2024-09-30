// Write a simple Node.js program for an eCommerce applicaton using an SQLite database.
// The applicaton should have four tables: client, product, order, and order_details. T
// The program should expose REST API endpoints for basic CRUD operatons on each table, allowing users to:


const sqlite3 = require("sqlite3").verbose();
const express = require("express");
const bodyParser = require("body-parser");

// Create the express App
const app = express();
app.use(bodyParser.json());
// Open database file
const db = new sqlite3.Database("database.db");

// db Creation
// Create tables
db.serialize(() => {
  // - client table should store informaton about the client (e.g., client ID, name, email).
  db.run("DROP TABLE IF EXISTS client");

  db.run(`CREATE TABLE client (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name TEXT NOT NULL,
        email TEXT NOT NULL
        )`);

        db.run("DROP TABLE IF EXISTS product");
  // - product table should store product informaton (e.g., product ID, name, price, stock).
  db.run(`CREATE TABLE product (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name TEXT NOT NULL,
        price REAL NOT NULL,
        stock INTEGER NOT NULL
        )`);

        db.run("DROP TABLE IF EXISTS order_table");
  // - order table should store order informaton (e.g., order ID, client ID, order date).
  db.run(`CREATE TABLE order_table (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        client_id INTEGER,
        order_date TEXT NOT NULL,
        FOREIGN KEY (client_id) REFERENCES client(id)
        )`);

        db.run("DROP TABLE IF EXISTS order_details");
  // - order_details table should store details of the products in an order (e.g., order ID, product ID, quantty).
  db.run(`CREATE TABLE order_details (
        order_id INTEGER,
        product_id INTEGER,
        quantity INTEGER NOT NULL,
        PRIMARY KEY (order_id, product_id),
        FOREIGN KEY (order_id) REFERENCES order_table(id), FOREIGN KEY (product_id) REFERENCES product(id)
        )`);
});

// 1. Create, read, update, and delete clients.
// Creating Clients
app.post("/clients", (req, res) => {
  const { name, email } = req.body;
  db.run(
    `INSERT INTO client (name, email) VALUES (?, ?)`,
    [name, email],
    function (err) {
      if (err) return res.status(500).send(err.message);
      res.send({ id: this.lastID });
    }
  );
});

// Read Clients
app.get("/clients", (req, res) => {
  db.all(`SELECT * FROM client`, [], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.send(rows);
  });
});

// Update Clients
app.put("/clients/:id", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  db.run(
    `UPDATE client SET name = ?, email = ? WHERE id = ?`,
    [name, email, id],
    function (err) {
      if (err) return res.status(500).send(err.message);
      res.send({ updated: this.changes });
    }
  );
});

// Delete Clients
app.delete("/clients/:id", (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM client WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).send(err.message);
    res.send({ deleted: this.changes });
  });
});

// Crud for products
// 2. Add, view, update, and delete products.
// Create Products
app.post("/products", (req, res) => {
  const { name, price, stock } = req.body;
  db.run(
    `INSERT INTO product (name, price, stock) VALUES (?, ?, ?)`,
    [name, price, stock],
    function (err) {
      if (err) return res.status(500).send(err.message);
      res.send({ id: this.lastID });
    }
  );
});

// Read Products
app.get("/products", (req, res) => {
  db.all(`SELECT * FROM product`, [], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.send(rows);
  });
});

// Update Products
app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, price, stock } = req.body;
  db.run(
    `UPDATE product SET name = ?, price = ?, stock = ? WHERE id = ?`,
    [name, price, stock, id],
    function (err) {
      if (err) return res.status(500).send(err.message);
      res.send({ updated: this.changes });
    }
  );
});

// Delete Products
app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM product WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).send(err.message);
    res.send({ deleted: this.changes });
  });
});

// 3. Place an order.
// Create Orders
app.post("/orders", (req, res) => {
  const { client_id, order_date } = req.body;
  db.run(
    `INSERT INTO order_table (client_id, order_date) VALUES (?, ?)`,
    [client_id, order_date],
    function (err) {
      if (err) return res.status(500).send(err.message);
      res.send({ id: this.lastID });
    }
  );
});

// 4. View details of an order.
app.get('/orders/:id', (req, res) => {
    const { id } = req.params;
    db.get(`SELECT * FROM order_table WHERE id = ?`, [id], (err, order) => {
    if (err) return res.status(500).send(err.message);
    db.all(`SELECT product_id, quantity FROM order_details WHERE order_id = ?`, [id], (err, products) => {
    if (err) return res.status(500).send(err.message);
    res.send({ order, products }); });
    }); });

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
