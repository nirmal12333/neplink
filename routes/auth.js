const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dbService = require('../services/dbService');
const router = express.Router();

// Register route
router.post('/register', (req, res) => {
    const { name, email, password, userType } = req.body;

    // Validate input
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    // Password strength validation
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    dbService.findUserByEmail(email, (err, existingUser) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Create new user
        const userData = { name, email, password, userType };
        dbService.createUser(userData, (err, newUser) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: newUser.id, email: newUser.email, userType: newUser.userType },
                process.env.JWT_SECRET || 'fallback_secret_key',
                { expiresIn: '24h' }
            );

            res.status(201).json({
                message: 'User registered successfully',
                token,
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    userType: newUser.userType
                }
            });
        });
    });
});

// Login route
router.post('/login', (req, res) => {
    const { email, password, userType } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    dbService.findUserByEmail(email, (err, user) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check user type if specified
        if (userType && user.user_type !== userType) {
            return res.status(401).json({ message: `Invalid credentials for ${userType}` });
        }

        // Compare passwords
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Password comparison error:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id, email: user.email, userType: user.user_type },
                process.env.JWT_SECRET || 'fallback_secret_key',
                { expiresIn: '24h' }
            );

            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    userType: user.user_type
                }
            });
        });
    });
});

module.exports = router;