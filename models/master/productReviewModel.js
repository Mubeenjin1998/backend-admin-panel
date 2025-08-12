const mongoose = require('mongoose');

const productReviewSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  store_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  customer_name: {
    type: String,
    maxlength: 100
  },
  email: {
    type: String,
    maxlength: 100
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review_title: {
    type: String,
    maxlength: 200
  },
  review_text: {
    type: String
  },
  is_verified_purchase: {
    type: Boolean,
    default: false
  },
  is_approved: {
    type: Boolean,
    default: false
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

productReviewSchema.index({ product_id: 1 });
productReviewSchema.index({ store_id: 1 });
productReviewSchema.index({ rating: 1 });
productReviewSchema.index({ is_approved: 1 });

productReviewSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('ProductReview', productReviewSchema);
