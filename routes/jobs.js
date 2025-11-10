const express = require('express');
const { check, validationResult } = require('express-validator');
const db = require('../database');
const { auth, admin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/jobs
// @desc    Get all jobs
// @access  Public
router.get('/', (req, res) => {
  try {
    const jobs = db.getAllJobs();
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/jobs/admin
// @desc    Get all jobs (admin view)
// @access  Private/Admin
router.get('/admin', auth, admin, (req, res) => {
  try {
    const jobs = db.getAllJobsAdmin();
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/jobs/:id
// @desc    Get job by ID
// @access  Public
router.get('/:id', (req, res) => {
  try {
    const job = db.getJobById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }
    
    // Only return active jobs to non-admins
    if (!job.active) {
      return res.status(404).json({ msg: 'Job not found' });
    }
    
    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/jobs
// @desc    Add job
// @access  Private
router.post('/', [
  auth,
  check('title', 'Title is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('company', 'Company is required').not().isEmpty(),
  check('location', 'Location is required').not().isEmpty(),
  check('type', 'Job type is required').not().isEmpty(),
  check('category', 'Category is required').not().isEmpty(),
  check('postedBy', 'Posted by is required').not().isEmpty(),
  check('postedById', 'Posted by ID is required').not().isEmpty(),
  check('contactEmail', 'Contact email is required').isEmail()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, company, location, type, category, salary, requirements, postedBy, postedById, contactEmail, contactPhone, deadline } = req.body;

    const job = db.createJob({
      title,
      description,
      company,
      location,
      type,
      category,
      salary,
      requirements,
      postedBy,
      postedById,
      contactEmail,
      contactPhone,
      deadline
    });

    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/jobs/:id
// @desc    Update job
// @access  Private
router.put('/:id', [
  auth
], (req, res) => {
  const { title, description, company, location, type, category, salary, requirements, contactEmail, contactPhone, deadline, active } = req.body;

  // Build job object
  const jobFields = {};
  if (title) jobFields.title = title;
  if (description) jobFields.description = description;
  if (company) jobFields.company = company;
  if (location) jobFields.location = location;
  if (type) jobFields.type = type;
  if (category) jobFields.category = category;
  if (salary) jobFields.salary = salary;
  if (requirements) jobFields.requirements = requirements;
  if (contactEmail) jobFields.contactEmail = contactEmail;
  if (contactPhone) jobFields.contactPhone = contactPhone;
  if (deadline) jobFields.deadline = deadline;
  if (active !== undefined) jobFields.active = active;

  try {
    let job = db.getJobById(req.params.id);

    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    // Check if user is owner or admin
    if (job.postedById != req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    job = db.updateJob(req.params.id, jobFields);

    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete job
// @access  Private
router.delete('/:id', [
  auth
], (req, res) => {
  try {
    const job = db.getJobById(req.params.id);

    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    // Check if user is owner or admin
    if (job.postedById != req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const result = db.deleteJob(req.params.id);
    if (result) {
      res.json({ msg: 'Job removed' });
    } else {
      res.status(500).json({ msg: 'Failed to remove job' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;