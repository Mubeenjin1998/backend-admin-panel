const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  store_name: {
    type: String,
    required: true,
    maxlength: 150
  },
  store_description: {
    type: String
  },
  owner_name: {
    type: String,
    maxlength: 100
  },
  email: {
    type: String,
    unique: true,
    maxlength: 100
  },
  phone: {
    type: String,
    maxlength: 20
  },
  address: {
    type: String
  },
  city: {
    type: String,
    maxlength: 50
  },
  state: {
    type: String,
    maxlength: 50
  },
  country: {
    type: String,
    maxlength: 50
  },
  postal_code: {
    type: String,
    maxlength: 10
  },
  is_active: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0.00,
    min: 0,
    max: 5
  },
  total_reviews: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

storeSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('Store', storeSchema);
