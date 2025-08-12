const mongoose = require('mongoose');

const productSpecificationSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  spec_name: {
    type: String,
    required: true,
    maxlength: 100
  },
  spec_value: {
    type: String,
    required: true,
    maxlength: 255
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

productSpecificationSchema.index({ product_id: 1 });

module.exports = mongoose.model('ProductSpecification', productSpecificationSchema);
