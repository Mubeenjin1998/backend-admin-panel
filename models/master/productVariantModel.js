const mongoose = require('mongoose')


const productVariantSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  sku: {
    type: String,
    required: true,
    // unique: true,
    uppercase: true,
    trim: true
  },
  variant_name: {
    type: String,
    trim: true
  },
  // Combination of attributes for this variant
  // Example: [{ attribute_id: colorAttrId, value_id: redValueId }, { attribute_id: sizeAttrId, value_id: largeValueId }]
  attributes: [{
    attribute_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VariantAttribute',
      required: true
    },
    value_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'variantAttributeValue',
      required: true
    },
    _id: false
  }],
  
  base_price: {
    type: Number,
    min: 0
  },
  weight: {
    type: Number,
    min: 0
  },
  images: [String],
  
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


productVariantSchema.index({ product_id: 1, sku: 1 }, { unique: true });

productVariantSchema.index({ 'attributes.attribute_id': 1 });
productVariantSchema.index({ is_active: 1 });

productVariantSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('ProductVariant', productVariantSchema);
