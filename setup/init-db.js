const db = require('../config/db');

// Read the SQL file
const fs = require('fs');
const path = require('path');

const sqlFilePath = path.join(__dirname, 'db-setup.sql');
const sql = fs.readFileSync(sqlFilePath, 'utf8');

// Execute the SQL commands
db.query(sql, (err, results) => {
    if (err) {
        console.error('Error initializing database:', err);
        return;
    }
    console.log('Database initialized successfully');
    console.log('Results:', results);
    
    // Close the connection
    db.end((err) => {
        if (err) {
            console.error('Error closing database connection:', err);
            return;
        }
        console.log('Database connection closed');
    });
});