const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subcategory_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  store_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    // required: true
  },
  brand_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'brands',
    // required: true
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  imageUrl: {
  type: [String] 
  },
  status: {
  type: String,
  enum: ['incompleted', 'completed'],
  default: 'incompleted',
  },

  isActive : {
    type:Boolean,
    default:true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', ProductSchema);
