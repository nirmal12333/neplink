const express = require('express');
const { check, validationResult } = require('express-validator');
const db = require('../database');
const { auth, admin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/news
// @desc    Get all news
// @access  Public
router.get('/', (req, res) => {
  try {
    const news = db.getAllNews();
    res.json(news);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/news/admin
// @desc    Get all news (admin view - includes unpublished)
// @access  Private/Admin
router.get('/admin', auth, admin, (req, res) => {
  try {
    const news = db.getAllNewsAdmin();
    res.json(news);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/news/:id
// @desc    Get news by ID
// @access  Public
router.get('/:id', (req, res) => {
  try {
    const news = db.getNewsById(req.params.id);
    
    if (!news) {
      return res.status(404).json({ msg: 'News not found' });
    }
    
    // Only return published news to non-admins
    if (!news.published) {
      return res.status(404).json({ msg: 'News not found' });
    }
    
    res.json(news);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/news
// @desc    Add news
// @access  Private/Admin
router.post('/', [
  auth,
  admin,
  check('title', 'Title is required').not().isEmpty(),
  check('content', 'Content is required').not().isEmpty(),
  check('category', 'Category is required').not().isEmpty(),
  check('author', 'Author is required').not().isEmpty()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, content, category, author, image, tags } = req.body;

    const news = db.createNews({
      title,
      content,
      category,
      author,
      image,
      tags
    });

    res.json(news);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/news/:id
// @desc    Update news
// @access  Private/Admin
router.put('/:id', [
  auth,
  admin
], (req, res) => {
  const { title, content, category, author, image, tags, published } = req.body;

  // Build news object
  const newsFields = {};
  if (title) newsFields.title = title;
  if (content) newsFields.content = content;
  if (category) newsFields.category = category;
  if (author) newsFields.author = author;
  if (image) newsFields.image = image;
  if (tags) newsFields.tags = tags;
  if (published !== undefined) newsFields.published = published;

  try {
    let news = db.getNewsById(req.params.id);

    if (!news) {
      return res.status(404).json({ msg: 'News not found' });
    }

    news = db.updateNews(req.params.id, newsFields);

    res.json(news);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/news/:id
// @desc    Delete news
// @access  Private/Admin
router.delete('/:id', [
  auth,
  admin
], (req, res) => {
  try {
    const news = db.getNewsById(req.params.id);

    if (!news) {
      return res.status(404).json({ msg: 'News not found' });
    }

    const result = db.deleteNews(req.params.id);
    if (result) {
      res.json({ msg: 'News removed' });
    } else {
      res.status(500).json({ msg: 'Failed to remove news' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;