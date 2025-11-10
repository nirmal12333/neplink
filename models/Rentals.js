const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  address: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zip: {
      type: String
    }
  },
  propertyType: {
    type: String,
    required: true,
    enum: ['Apartment', 'House', 'Room', 'Commercial', 'Other']
  },
  bedrooms: {
    type: Number,
    required: true
  },
  bathrooms: {
    type: Number,
    required: true
  },
  area: {
    type: Number, // in square feet
    required: true
  },
  rent: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'NPR'
  },
  amenities: [{
    type: String
  }],
  images: [{
    type: String
  }],
  contactPerson: {
    type: String,
    required: true
  },
  contactEmail: {
    type: String,
    required: true
  },
  contactPhone: {
    type: String
  },
  postedBy: {
    type: String,
    required: true
  },
  postedById: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  available: {
    type: Boolean,
    default: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Rental', rentalSchema);