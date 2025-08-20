const mongoose = require('mongoose');

const variantAttributeValueSchema = new mongoose.Schema({
  attribute_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VariantAttribute',
    required: true
  },
  value: {
    type: String,
    required: true 
  },
  display_value: {
    type: String,
    required: true 
  },
  color_code: {
    type: String, 
    validate: {
      validator: function(v) {
        return !v || /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
      },
      message: 'Invalid hex color code'
    }
  },
  sort_order: {
    type: Number,
    default: 0
  },
  is_active: {
    type: Boolean,
    default: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('variantAttributeValue', variantAttributeValueSchema);




