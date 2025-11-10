const express = require('express');
const { check, validationResult } = require('express-validator');
const db = require('../database');
const { auth, admin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/marketplace
// @desc    Get all marketplace items
// @access  Public
router.get('/', (req, res) => {
  try {
    const items = db.getAllMarketplaceItems();
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/marketplace/admin
// @desc    Get all marketplace items (admin view)
// @access  Private/Admin
router.get('/admin', auth, admin, (req, res) => {
  try {
    const items = db.getAllMarketplaceItemsAdmin();
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/marketplace/:id
// @desc    Get marketplace item by ID
// @access  Public
router.get('/:id', (req, res) => {
  try {
    const item = db.getMarketplaceItemById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }
    
    // Only return available items to non-admins
    if (!item.available) {
      return res.status(404).json({ msg: 'Item not found' });
    }
    
    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/marketplace
// @desc    Add marketplace item
// @access  Private
router.post('/', [
  auth,
  check('name', 'Name is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('price', 'Price is required').isNumeric(),
  check('category', 'Category is required').not().isEmpty(),
  check('seller', 'Seller is required').not().isEmpty(),
  check('sellerId', 'Seller ID is required').not().isEmpty(),
  check('location', 'Location is required').not().isEmpty()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, description, price, category, seller, sellerId, images, condition, location } = req.body;

    const item = db.createMarketplaceItem({
      name,
      description,
      price,
      category,
      seller,
      sellerId,
      images,
      condition,
      location
    });

    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/marketplace/:id
// @desc    Update marketplace item
// @access  Private
router.put('/:id', [
  auth
], (req, res) => {
  const { name, description, price, category, seller, images, condition, location, available } = req.body;

  // Build item object
  const itemFields = {};
  if (name) itemFields.name = name;
  if (description) itemFields.description = description;
  if (price) itemFields.price = price;
  if (category) itemFields.category = category;
  if (seller) itemFields.seller = seller;
  if (images) itemFields.images = images;
  if (condition) itemFields.condition = condition;
  if (location) itemFields.location = location;
  if (available !== undefined) itemFields.available = available;

  try {
    let item = db.getMarketplaceItemById(req.params.id);

    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }

    // Check if user is owner or admin
    if (item.sellerId != req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    item = db.updateMarketplaceItem(req.params.id, itemFields);

    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/marketplace/:id
// @desc    Delete marketplace item
// @access  Private
router.delete('/:id', [
  auth
], (req, res) => {
  try {
    const item = db.getMarketplaceItemById(req.params.id);

    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }

    // Check if user is owner or admin
    if (item.sellerId != req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const result = db.deleteMarketplaceItem(req.params.id);
    if (result) {
      res.json({ msg: 'Item removed' });
    } else {
      res.status(500).json({ msg: 'Failed to remove item' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;