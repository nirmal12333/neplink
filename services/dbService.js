const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Fallback in-memory database
let inMemoryDB = {
    users: [],
    news: [],
    marketplace: [],
    jobs: [],
    rentals: []
};

// Initialize with sample data if using in-memory database
if (!db) {
    console.log('Using in-memory database as fallback');
    
    // Sample users with hashed passwords
    const sampleUsers = [
        { id: 1, name: 'Admin User', email: 'admin@neplink.com', password: '$2b$10$8K1p/a0dURXAm7QiTRqNa.E3YPWsKGHJrTJE29YZB8qJwE1uF3c9S', user_type: 'admin' },
        { id: 2, name: 'John Doe', email: 'john@example.com', password: '$2b$10$8K1p/a0dURXAm7QiTRqNa.E3YPWsKGHJrTJE29YZB8qJwE1uF3c9S', user_type: 'user' },
        { id: 3, name: 'Business Owner', email: 'owner@neplink.com', password: '$2b$10$8K1p/a0dURXAm7QiTRqNa.E3YPWsKGHJrTJE29YZB8qJwE1uF3c9S', user_type: 'owner' }
    ];
    
    inMemoryDB.users = sampleUsers;
}

// User operations
const createUser = (userData, callback) => {
    const { name, email, password, userType } = userData;
    
    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return callback(err, null);
        }
        
        if (db) {
            // Use MySQL
            const query = 'INSERT INTO users (name, email, password, user_type) VALUES (?, ?, ?, ?)';
            db.execute(query, [name, email, hashedPassword, userType || 'user'], (err, result) => {
                if (err) {
                    return callback(err, null);
                }
                callback(null, { id: result.insertId, name, email, userType: userType || 'user' });
            });
        } else {
            // Use in-memory database
            const newUser = {
                id: inMemoryDB.users.length + 1,
                name,
                email,
                password: hashedPassword,
                user_type: userType || 'user'
            };
            inMemoryDB.users.push(newUser);
            callback(null, newUser);
        }
    });
};

const findUserByEmail = (email, callback) => {
    if (db) {
        // Use MySQL
        const query = 'SELECT * FROM users WHERE email = ?';
        db.execute(query, [email], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            if (results.length === 0) {
                return callback(null, null);
            }
            callback(null, results[0]);
        });
    } else {
        // Use in-memory database
        const user = inMemoryDB.users.find(u => u.email === email);
        callback(null, user || null);
    }
};

const findUserById = (id, callback) => {
    if (db) {
        // Use MySQL
        const query = 'SELECT id, name, email, user_type FROM users WHERE id = ?';
        db.execute(query, [id], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            if (results.length === 0) {
                return callback(null, null);
            }
            callback(null, results[0]);
        });
    } else {
        // Use in-memory database
        const user = inMemoryDB.users.find(u => u.id === parseInt(id));
        if (user) {
            // Return user without password
            const { password, ...userWithoutPassword } = user;
            callback(null, userWithoutPassword);
        } else {
            callback(null, null);
        }
    }
};

// News operations
const getAllNews = (callback) => {
    if (db) {
        // Use MySQL
        const query = 'SELECT * FROM news ORDER BY created_at DESC';
        db.execute(query, (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    } else {
        // Use in-memory database
        callback(null, inMemoryDB.news);
    }
};

const createNews = (newsData, callback) => {
    if (db) {
        // Use MySQL
        const { title, content, category, author, image, published } = newsData;
        const query = 'INSERT INTO news (title, content, category, author, image, published) VALUES (?, ?, ?, ?, ?, ?)';
        db.execute(query, [title, content, category, author, image, published], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, { id: result.insertId, ...newsData });
        });
    } else {
        // Use in-memory database
        const newNews = {
            id: inMemoryDB.news.length + 1,
            ...newsData,
            created_at: new Date()
        };
        inMemoryDB.news.push(newNews);
        callback(null, newNews);
    }
};

// Marketplace operations
const getAllMarketplaceItems = (callback) => {
    if (db) {
        // Use MySQL
        const query = 'SELECT * FROM marketplace ORDER BY created_at DESC';
        db.execute(query, (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    } else {
        // Use in-memory database
        callback(null, inMemoryDB.marketplace);
    }
};

const createMarketplaceItem = (itemData, callback) => {
    if (db) {
        // Use MySQL
        const { name, description, price, category, condition, location, images, ownerId } = itemData;
        const query = 'INSERT INTO marketplace (name, description, price, category, condition, location, images, owner_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        db.execute(query, [name, description, price, category, condition, location, JSON.stringify(images), ownerId], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, { id: result.insertId, ...itemData });
        });
    } else {
        // Use in-memory database
        const newItem = {
            id: inMemoryDB.marketplace.length + 1,
            ...itemData,
            created_at: new Date()
        };
        inMemoryDB.marketplace.push(newItem);
        callback(null, newItem);
    }
};

// Jobs operations
const getAllJobs = (callback) => {
    if (db) {
        // Use MySQL
        const query = 'SELECT * FROM jobs ORDER BY created_at DESC';
        db.execute(query, (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    } else {
        // Use in-memory database
        callback(null, inMemoryDB.jobs);
    }
};

const createJob = (jobData, callback) => {
    if (db) {
        // Use MySQL
        const { title, type, company, location, category, salaryMin, salaryMax, description, requirements, contactEmail, contactPhone, postedBy } = jobData;
        const query = 'INSERT INTO jobs (title, type, company, location, category, salary_min, salary_max, description, requirements, contact_email, contact_phone, posted_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        db.execute(query, [title, type, company, location, category, salaryMin, salaryMax, description, JSON.stringify(requirements), contactEmail, contactPhone, postedBy], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, { id: result.insertId, ...jobData });
        });
    } else {
        // Use in-memory database
        const newJob = {
            id: inMemoryDB.jobs.length + 1,
            ...jobData,
            created_at: new Date()
        };
        inMemoryDB.jobs.push(newJob);
        callback(null, newJob);
    }
};

// Rentals operations
const getAllRentals = (callback) => {
    if (db) {
        // Use MySQL
        const query = 'SELECT * FROM rentals ORDER BY created_at DESC';
        db.execute(query, (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    } else {
        // Use in-memory database
        callback(null, inMemoryDB.rentals);
    }
};

const createRental = (rentalData, callback) => {
    if (db) {
        // Use MySQL
        const { title, description, propertyType, rent, bedrooms, bathrooms, area, street, city, state, zip, amenities, images, contactPerson, contactEmail, contactPhone, ownerId } = rentalData;
        const query = 'INSERT INTO rentals (title, description, property_type, rent, bedrooms, bathrooms, area, street, city, state, zip, amenities, images, contact_person, contact_email, contact_phone, owner_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        db.execute(query, [title, description, propertyType, rent, bedrooms, bathrooms, area, street, city, state, zip, JSON.stringify(amenities), JSON.stringify(images), contactPerson, contactEmail, contactPhone, ownerId], (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, { id: result.insertId, ...rentalData });
        });
    } else {
        // Use in-memory database
        const newRental = {
            id: inMemoryDB.rentals.length + 1,
            ...rentalData,
            created_at: new Date()
        };
        inMemoryDB.rentals.push(newRental);
        callback(null, newRental);
    }
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    getAllNews,
    createNews,
    getAllMarketplaceItems,
    createMarketplaceItem,
    getAllJobs,
    createJob,
    getAllRentals,
    createRental
};