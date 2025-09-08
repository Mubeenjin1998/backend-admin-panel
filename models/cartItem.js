const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productSnapshot: {
    productName: String,
    imageUrl: String,
    sku: String
  },
  variantId: {
    type: Schema.Types.ObjectId,
    default: null 
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    max: 999
  },
  priceAtTime: {
    type: Number,
    required: true,
    min: 0,
    max: 999999.99
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = cartItemSchema;