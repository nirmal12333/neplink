const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Serve sectors directory
app.use('/sectors', express.static(path.join(__dirname, 'sectors')));

// Serve login page
app.use('/login', express.static(path.join(__dirname, 'login')));

// Serve admin panel
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));

// Database connection
const db = require('./config/db');

// Test database connection
if (db) {
    db.query('SELECT 1 + 1 AS solution', (err, results) => {
        if (err) {
            console.error('Database connection failed:', err);
        } else {
            console.log('Database connected successfully');
        }
    });
} else {
    console.log('Using in-memory database as fallback');
}

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;