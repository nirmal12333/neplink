const express = require('express');
const dbService = require('../services/dbService');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const router = express.Router();

// News routes
router.get('/news', (req, res) => {
    dbService.getAllNews((err, news) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json(news);
    });
});

router.post('/news', authenticateToken, authorizeRole(['admin', 'owner']), (req, res) => {
    const { title, content, category, author, image, published } = req.body;
    
    // Validate input
    if (!title || !content || !category || !author) {
        return res.status(400).json({ message: 'Title, content, category, and author are required' });
    }
    
    const newsData = { title, content, category, author, image, published };
    dbService.createNews(newsData, (err, newNews) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.status(201).json(newNews);
    });
});

// Marketplace routes
router.get('/marketplace', (req, res) => {
    dbService.getAllMarketplaceItems((err, items) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json(items);
    });
});

router.post('/marketplace', authenticateToken, authorizeRole(['owner']), (req, res) => {
    const { name, description, price, category, condition, location, images } = req.body;
    
    // Validate input
    if (!name || !description || !price || !category || !condition || !location) {
        return res.status(400).json({ message: 'Name, description, price, category, condition, and location are required' });
    }
    
    const ownerId = req.user.id || req.user.userId;
    
    const itemData = { name, description, price, category, condition, location, images, ownerId };
    dbService.createMarketplaceItem(itemData, (err, newItem) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.status(201).json(newItem);
    });
});

// Jobs routes
router.get('/jobs', (req, res) => {
    dbService.getAllJobs((err, jobs) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json(jobs);
    });
});

router.post('/jobs', authenticateToken, authorizeRole(['owner']), (req, res) => {
    const { title, type, company, location, category, salaryMin, salaryMax, description, requirements, contactEmail, contactPhone } = req.body;
    
    // Validate input
    if (!title || !type || !company || !location || !category || !description || !contactEmail) {
        return res.status(400).json({ message: 'Title, type, company, location, category, description, and contact email are required' });
    }
    
    const postedBy = req.user.id || req.user.userId;
    
    const jobData = { title, type, company, location, category, salaryMin, salaryMax, description, requirements, contactEmail, contactPhone, postedBy };
    dbService.createJob(jobData, (err, newJob) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.status(201).json(newJob);
    });
});

// Rentals routes
router.get('/rentals', (req, res) => {
    dbService.getAllRentals((err, rentals) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.json(rentals);
    });
});

router.post('/rentals', authenticateToken, authorizeRole(['owner']), (req, res) => {
    const { title, description, propertyType, rent, bedrooms, bathrooms, area, street, city, state, zip, amenities, images, contactPerson, contactEmail, contactPhone } = req.body;
    
    // Validate input
    if (!title || !description || !propertyType || !rent || !bedrooms || !bathrooms || !area || !street || !city || !state || !contactPerson || !contactEmail) {
        return res.status(400).json({ message: 'Title, description, property type, rent, bedrooms, bathrooms, area, street, city, state, contact person, and contact email are required' });
    }
    
    const ownerId = req.user.id || req.user.userId;
    
    const rentalData = { title, description, propertyType, rent, bedrooms, bathrooms, area, street, city, state, zip, amenities, images, contactPerson, contactEmail, contactPhone, ownerId };
    dbService.createRental(rentalData, (err, newRental) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.status(201).json(newRental);
    });
});

module.exports = router;