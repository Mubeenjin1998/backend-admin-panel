const mongoose = require('mongoose');

const productImageSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  image_url: {
    type: String,
    required: true,
    maxlength: 255
  },
  alt_text: {
    type: String,
    maxlength: 255
  },
  is_primary: {
    type: Boolean,
    default: false
  },
  display_order: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ProductImage', productImageSchema);
