// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (like your HTML, CSS, and JS)
app.use(express.static('public'));

// SQLite database setup
const db = new sqlite3.Database('./budget_tracker.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

// Create a table for income and expenses if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS budget (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    month TEXT NOT NULL,
    income REAL,
    expenses REAL,
    savings REAL
  )
`);

// API routes

// POST to add budget data
app.post('/addBudget', (req, res) => {
    const { username, month, income, expenses, savings } = req.body;

    const sql = `INSERT INTO budget (username, month, income, expenses, savings) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [username, month, income, expenses, savings], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'Data inserted successfully', id: this.lastID });
    });
});

// GET user budget data
app.get('/getBudget/:username', (req, res) => {
    const username = req.params.username;
    const sql = `SELECT * FROM budget WHERE username = ?`;
    db.all(sql, [username], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ data: rows });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
