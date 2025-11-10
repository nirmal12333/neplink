const mysql = require('mysql2');
require('dotenv').config();

let connection;

try {
    // Try to create a connection to the database
    connection = mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'neplink'
    });

    // Connect to the database
    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to the MySQL database:', err);
            console.log('Falling back to in-memory database');
            connection = null;
        } else {
            console.log('Successfully connected to the MySQL database.');
        }
    });

    // Handle connection errors
    connection.on('error', (err) => {
        console.error('Database error:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('Database connection was closed.');
        }
    });
} catch (err) {
    console.error('Failed to initialize MySQL connection:', err);
    console.log('Falling back to in-memory database');
    connection = null;
}

module.exports = connection;