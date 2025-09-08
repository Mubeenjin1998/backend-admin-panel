const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartHistorySchema = new Schema({
  cartId: {
    type: Schema.Types.ObjectId,
    ref: 'ShoppingCart',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  sessionId: {
    type: String,
    trim: true
  },
  actionType: {
    type: String,
    enum: ['ADD', 'UPDATE', 'REMOVE', 'CLEAR', 'EXPIRE', 'CONVERT'],
    required: true
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  },
  quantityBefore: {
    type: Number,
    min: 0
  },
  quantityAfter: {
    type: Number,
    min: 0
  },
  priceAtTime: {
    type: Number,
    min: 0
  },
  metadata: {
    type: Schema.Types.Mixed 
  },
  userAgent: String,
  ipAddress: String
}, {
  timestamps: { createdAt: 'actionTimestamp', updatedAt: false }
});

cartHistorySchema.index({ cartId: 1, actionTimestamp: -1 });
cartHistorySchema.index({ userId: 1, actionTimestamp: -1 });
cartHistorySchema.index({ actionTimestamp: -1 });
cartHistorySchema.index({ actionType: 1, actionTimestamp: -1 });

module.exports = mongoose.model('CartHistory', cartHistorySchema);
