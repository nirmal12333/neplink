const express = require('express');
const { check, validationResult } = require('express-validator');
const db = require('../database');
const { auth, admin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/rentals
// @desc    Get all rentals
// @access  Public
router.get('/', (req, res) => {
  try {
    const rentals = db.getAllRentals();
    res.json(rentals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/rentals/admin
// @desc    Get all rentals (admin view)
// @access  Private/Admin
router.get('/admin', auth, admin, (req, res) => {
  try {
    const rentals = db.getAllRentalsAdmin();
    res.json(rentals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/rentals/:id
// @desc    Get rental by ID
// @access  Public
router.get('/:id', (req, res) => {
  try {
    const rental = db.getRentalById(req.params.id);
    
    if (!rental) {
      return res.status(404).json({ msg: 'Rental not found' });
    }
    
    // Only return available rentals to non-admins
    if (!rental.available) {
      return res.status(404).json({ msg: 'Rental not found' });
    }
    
    res.json(rental);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/rentals
// @desc    Add rental
// @access  Private
router.post('/', [
  auth,
  check('title', 'Title is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('address.street', 'Street is required').not().isEmpty(),
  check('address.city', 'City is required').not().isEmpty(),
  check('address.state', 'State is required').not().isEmpty(),
  check('propertyType', 'Property type is required').not().isEmpty(),
  check('bedrooms', 'Number of bedrooms is required').isNumeric(),
  check('bathrooms', 'Number of bathrooms is required').isNumeric(),
  check('area', 'Area is required').isNumeric(),
  check('rent', 'Rent is required').isNumeric(),
  check('contactPerson', 'Contact person is required').not().isEmpty(),
  check('contactEmail', 'Contact email is required').isEmail(),
  check('postedBy', 'Posted by is required').not().isEmpty(),
  check('postedById', 'Posted by ID is required').not().isEmpty()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, address, propertyType, bedrooms, bathrooms, area, rent, currency, amenities, images, contactPerson, contactEmail, contactPhone, postedBy, postedById } = req.body;

    const rental = db.createRental({
      title,
      description,
      address,
      propertyType,
      bedrooms,
      bathrooms,
      area,
      rent,
      currency,
      amenities,
      images,
      contactPerson,
      contactEmail,
      contactPhone,
      postedBy,
      postedById
    });

    res.json(rental);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/rentals/:id
// @desc    Update rental
// @access  Private
router.put('/:id', [
  auth
], (req, res) => {
  const { title, description, address, propertyType, bedrooms, bathrooms, area, rent, currency, amenities, images, contactPerson, contactEmail, contactPhone, available } = req.body;

  // Build rental object
  const rentalFields = {};
  if (title) rentalFields.title = title;
  if (description) rentalFields.description = description;
  if (address) rentalFields.address = address;
  if (propertyType) rentalFields.propertyType = propertyType;
  if (bedrooms) rentalFields.bedrooms = bedrooms;
  if (bathrooms) rentalFields.bathrooms = bathrooms;
  if (area) rentalFields.area = area;
  if (rent) rentalFields.rent = rent;
  if (currency) rentalFields.currency = currency;
  if (amenities) rentalFields.amenities = amenities;
  if (images) rentalFields.images = images;
  if (contactPerson) rentalFields.contactPerson = contactPerson;
  if (contactEmail) rentalFields.contactEmail = contactEmail;
  if (contactPhone) rentalFields.contactPhone = contactPhone;
  if (available !== undefined) rentalFields.available = available;

  try {
    let rental = db.getRentalById(req.params.id);

    if (!rental) {
      return res.status(404).json({ msg: 'Rental not found' });
    }

    // Check if user is owner or admin
    if (rental.postedById != req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    rental = db.updateRental(req.params.id, rentalFields);

    res.json(rental);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/rentals/:id
// @desc    Delete rental
// @access  Private
router.delete('/:id', [
  auth
], (req, res) => {
  try {
    const rental = db.getRentalById(req.params.id);

    if (!rental) {
      return res.status(404).json({ msg: 'Rental not found' });
    }

    // Check if user is owner or admin
    if (rental.postedById != req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const result = db.deleteRental(req.params.id);
    if (result) {
      res.json({ msg: 'Rental removed' });
    } else {
      res.status(500).json({ msg: 'Failed to remove rental' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;