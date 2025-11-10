const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Remote']
  },
  category: {
    type: String,
    required: true,
    enum: ['IT', 'Education', 'Healthcare', 'Finance', 'Hospitality', 'Retail', 'Other']
  },
  salary: {
    min: {
      type: Number
    },
    max: {
      type: Number
    },
    currency: {
      type: String,
      default: 'NPR'
    }
  },
  requirements: [{
    type: String
  }],
  postedBy: {
    type: String,
    required: true
  },
  postedById: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contactEmail: {
    type: String,
    required: true
  },
  contactPhone: {
    type: String
  },
  deadline: {
    type: Date
  },
  active: {
    type: Boolean,
    default: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Job', jobSchema);