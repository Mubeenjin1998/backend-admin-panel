// const mongoose = require('mongoose');

// const productStoreInventorySchema = new mongoose.Schema({
//   product_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Product',
//     required: true
//   },
//   store_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Store',
//     required: true
//   },
//   quantity: {
//     type: Number,
//     required: true,
//     default: 0,
//     min: 0
//   },
//   price: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   discounted_price: {
//     type: Number,
//     min: 0
//   },
//   min_quantity: {
//     type: Number,
//     default: 1,
//     min: 0
//   },
//   max_quantity: {
//     type: Number,
//     default: 999,
//     min: 0
//   },
//   is_available: {
//     type: Boolean,
//     default: true
//   },
//   last_restocked: {
//     type: Date
//   },
//   created_at: {
//     type: Date,
//     default: Date.now
//   },
//   updated_at: {
//     type: Date,
//     default: Date.now
//   }
// });

// productStoreInventorySchema.index({ product_id: 1, store_id: 1 }, { unique: true });
// productStoreInventorySchema.index({ product_id: 1 });
// productStoreInventorySchema.index({ store_id: 1 });
// productStoreInventorySchema.index({ is_available: 1 });

// productStoreInventorySchema.pre('save', function(next) {
//   this.updated_at = Date.now();
//   next();
// });

// module.exports = mongoose.model('ProductStoreInventory', productStoreInventorySchema);

const mongoose = require('mongoose');

const variantInventorySchema = new mongoose.Schema({
  variant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductVariant',
    required: true
  },
  sku: { type: String, required: true },
  quantity: {
    type: Number,
    default: 0,
    min: 0
  },
  reserved_quantity: {
    type: Number,
    default: 0,
    min: 0
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discounted_price: {
    type: Number,
    min: 0
  },
  min_quantity: {
    type: Number,
    default: 1,
    min: 0
  },
  max_quantity: {
    type: Number,
    default: 999,
    min: 0
  },
  low_stock_threshold: {
    type: Number,
    default: 5,
    min: 0
  },
  is_available: {
    type: Boolean,
    default: true
  },
  last_restocked: {
    type: Date
  }
}, { _id: false });

const productStoreInventorySchema = new mongoose.Schema({
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

  base_inventory: {
    quantity: { type: Number, default: 0, min: 0 },
    reserved_quantity: { type: Number, default: 0, min: 0 },
    price: { type: Number, min: 0 },
    discounted_price: { type: Number, min: 0 },
    min_quantity: { type: Number, default: 1, min: 0 },
    max_quantity: { type: Number, default: 999, min: 0 },
    low_stock_threshold: { type: Number, default: 5, min: 0 },
    is_available: { type: Boolean, default: true },
    last_restocked: { type: Date }
  },

  variants: [variantInventorySchema],

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

productStoreInventorySchema.index({ product_id: 1, store_id: 1 }, { unique: true });
productStoreInventorySchema.index({ product_id: 1 });
productStoreInventorySchema.index({ store_id: 1 });
productStoreInventorySchema.index({ "variants.variant_id": 1 });
productStoreInventorySchema.index({ "variants.is_available": 1 });

productStoreInventorySchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('ProductStoreInventory', productStoreInventorySchema);

