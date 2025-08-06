const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  brand_name: {
    type: String,
    required: true,
    unique: true,
    maxlength: 100
  },
  brand_description: {
    type: String
  },
  logo_url: {
    type: String,
    maxlength: 255
  },
  website: {
    type: String,
    maxlength: 255
  },
  is_active: {
    type: Boolean,
    default: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Brand', brandSchema);
