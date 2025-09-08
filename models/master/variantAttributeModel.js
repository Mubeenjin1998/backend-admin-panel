const mongoose = require('mongoose');

const variantAttributeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true 
  },
  category_id:{
    type:[]
  },
  display_name: {
    type: String,
    required: true 
  },
  input_type: {
    type: String,
    enum: ['select', 'color_picker', 'text', 'number'],
    default: 'select'
  },
  is_required: {
    type: Boolean,
    default: false
  },
  is_active: {
    type: Boolean,
    default: true
  },
  sort_order: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('VariantAttribute', variantAttributeSchema);
