const express = require('express');
const db = require('../database');
const { auth, admin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/admin/stats
// @desc    Get admin dashboard statistics
// @access  Private/Admin
router.get('/stats', auth, admin, (req, res) => {
  try {
    const stats = {
      news: db.getAllNewsAdmin().length,
      marketplace: db.getAllMarketplaceItemsAdmin().length,
      jobs: db.getAllJobsAdmin().length,
      rentals: db.getAllRentalsAdmin().length,
      users: db.data.users.length
    };

    res.json(stats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', auth, admin, (req, res) => {
  try {
    // Return users without passwords
    const users = db.data.users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user role
// @access  Private/Admin
router.put('/users/:id', auth, admin, (req, res) => {
  try {
    const user = db.findUserById(parseInt(req.params.id));

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Prevent user from changing their own role
    if (user.id === req.user.id) {
      return res.status(400).json({ msg: 'You cannot change your own role' });
    }

    // Update user role
    user.role = req.body.role || user.role;

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/users/:id', auth, admin, (req, res) => {
  try {
    const user = db.findUserById(parseInt(req.params.id));

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Prevent user from deleting themselves
    if (user.id === req.user.id) {
      return res.status(400).json({ msg: 'You cannot delete yourself' });
    }

    // Remove user from database
    const index = db.data.users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      db.data.users.splice(index, 1);
      res.json({ msg: 'User removed' });
    } else {
      res.status(500).json({ msg: 'Failed to remove user' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/admin/news/:id/publish
// @desc    Publish/unpublish news
// @access  Private/Admin
router.put('/news/:id/publish', auth, admin, (req, res) => {
  try {
    const news = db.getNewsById(req.params.id);

    if (!news) {
      return res.status(404).json({ msg: 'News not found' });
    }

    news.published = req.body.published;

    res.json(news);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/admin/marketplace/:id/activate
// @desc    Activate/deactivate marketplace item
// @access  Private/Admin
router.put('/marketplace/:id/activate', auth, admin, (req, res) => {
  try {
    const item = db.getMarketplaceItemById(req.params.id);

    if (!item) {
      return res.status(404).json({ msg: 'Item not found' });
    }

    item.available = req.body.available;

    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/admin/jobs/:id/activate
// @desc    Activate/deactivate job
// @access  Private/Admin
router.put('/jobs/:id/activate', auth, admin, (req, res) => {
  try {
    const job = db.getJobById(req.params.id);

    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    job.active = req.body.active;

    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/admin/rentals/:id/activate
// @desc    Activate/deactivate rental
// @access  Private/Admin
router.put('/rentals/:id/activate', auth, admin, (req, res) => {
  try {
    const rental = db.getRentalById(req.params.id);

    if (!rental) {
      return res.status(404).json({ msg: 'Rental not found' });
    }

    rental.available = req.body.available;

    res.json(rental);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;