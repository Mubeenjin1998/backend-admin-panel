const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  subcategory_name: {
    type: String,
    required: true,
    maxlength: 100
  },
  subcategory_description: {
    type: String
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  is_active: {
    type: Boolean,
    default: true
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

subcategorySchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('Subcategory', subcategorySchema);
