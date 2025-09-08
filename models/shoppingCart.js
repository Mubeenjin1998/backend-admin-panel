const mongoose = require('mongoose');
const { Schema } = mongoose;
const cartItemSchema = require('./cartItem');

const shoppingCartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    sparse: true 
  },
  sessionId: {
    type: String,
    trim: true,
    maxlength: 100 
  },
  items: [cartItemSchema],
  status: {
    type: String,
    enum: ['active', 'abandoned', 'converted', 'expired'],
    default: 'active'
  },
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
  },
  totalItems: {
    type: Number,
    default: 0
  },
  totalQuantity: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'USD',
    maxlength: 3
  },
  couponCode: {
    type: String,
    trim: true
  },
  discountAmount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

shoppingCartSchema.index({ userId: 1, status: 1 });
shoppingCartSchema.index({ sessionId: 1, status: 1 });
shoppingCartSchema.index({ expiresAt: 1 });
shoppingCartSchema.index({ updatedAt: -1 });

shoppingCartSchema.pre('save', function(next) {
  if (this.items && this.items.length > 0) {
    this.totalItems = this.items.length;
    this.totalQuantity = this.items.reduce((sum, item) => sum + item.quantity, 0);
    this.totalAmount = this.items.reduce((sum, item) => sum + (item.quantity * item.priceAtTime), 0);
  } else {
    this.totalItems = 0;
    this.totalQuantity = 0;
    this.totalAmount = 0;
  }
  next();
});

shoppingCartSchema.methods.getNetTotal = function() {
  return Math.max(0, this.totalAmount - this.discountAmount);
};

shoppingCartSchema.methods.findItem = function(productId, variantId = null) {
  return this.items.find(item => 
    item.productId.toString() === productId.toString() && 
    (item.variantId?.toString() === variantId?.toString())
  );
};

module.exports = mongoose.model('ShoppingCart', shoppingCartSchema);