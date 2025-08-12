
const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point',
    required: true
  },
  coordinates: {
    type: [Number],
    required: true,
    validate: {
      validator: function(coords) {
        return coords.length === 2 && 
               coords[0] >= -180 && coords[0] <= 180 && 
               coords[1] >= -90 && coords[1] <= 90;     
      },
      message: 'Invalid coordinates. Longitude must be between -180 and 180, latitude between -90 and 90'
    }
  },
  address: {
    city: { type: String, maxlength: 50, trim: true },
    state: { type: String, maxlength: 50, trim: true },
    country: { type: String, maxlength: 50, trim: true },
    postal_code: { type: String, trim: true },
  }
}, { _id: false });

const contactSchema = new mongoose.Schema({
  email: {
    type: String,
    sparse: true, 
    maxlength: 100,
    trim: true,
    validate: {
      validator: function(email) {
        if (!email) return true; 
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: 'Invalid email format'
    }
  },
  phone: {
    country_code: {
      type: String,
      maxlength: 4,
      trim: true,
      default: '+1'
    },
    number: {
      type: String,
      maxlength: 15,
      trim: true,
      // validate: {
      //   validator: function(phone) {
      //     if (!phone) return true;
      //     return /^\d{10,15}$/.test(phone.replace(/[\s\-\(\)]/g, ''));
      //   },
      //   message: 'Invalid phone number format'
      // }
    }
  },
 
  social_media: {
    facebook: { type: String, trim: true },
    instagram: { type: String, trim: true },
    twitter: { type: String, trim: true }
  }
}, { _id: false });

const businessHoursSchema = new mongoose.Schema({
  monday: { open: String, close: String, closed: { type: Boolean, default: false } },
  tuesday: { open: String, close: String, closed: { type: Boolean, default: false } },
  wednesday: { open: String, close: String, closed: { type: Boolean, default: false } },
  thursday: { open: String, close: String, closed: { type: Boolean, default: false } },
  friday: { open: String, close: String, closed: { type: Boolean, default: false } },
  saturday: { open: String, close: String, closed: { type: Boolean, default: false } },
  sunday: { open: String, close: String, closed: { type: Boolean, default: false } }
}, { _id: false });

const storeSchema = new mongoose.Schema({
  store_name: {
    type: String,
    required: [true, 'Store name is required'],
    maxlength: [150, 'Store name cannot exceed 150 characters'],
    trim: true,
    index: true
  },
  
  store_description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    trim: true
  },
  
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    index: true
  },
  
  owner: {
    name: {
      type: String,
      maxlength: [100, 'Owner name cannot exceed 100 characters'],
      trim: true
    },
    email: {
      type: String,
      lowercase: true,
      trim: true
    }
  },
  
  contact: contactSchema,
  
  location: {
    type: locationSchema,
    index: '2dsphere' 
  },
  
category: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Category',
  // required: true,
  index: true
}],
  
business_hours: businessHoursSchema,
  
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'pending_verification'],
    default: 'pending_verification',
    index: true
  },
  
  is_verified: {
    type: Boolean,
    default: false,
    index: true
  },
  
  verification_date: {
    type: Date
  },
  
features: [{
    type: String,
    // enum: ['delivery', 'pickup', 'parking', 'wheelchair_accessible', 'wifi', 'accepts_cards', 'cash_only']
  }],
  
  images_url: {
    type: [String],
  },
  
deleted_at: {
    type: Date,
    default: null,
    index: { sparse: true }
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

storeSchema.index({ 'location': '2dsphere' }); 
storeSchema.index({ store_name: 'text', store_description: 'text' }); 
storeSchema.index({ category: 1, status: 1 }); 
storeSchema.index({ 'ratings.average': -1 }); 
storeSchema.index({ created_at: -1 }); 
storeSchema.index({ 'owner.email': 1 }, { unique: true, sparse: true });


storeSchema.virtual('full_address').get(function() {
  if (!this.location || !this.location.address) return '';
  
  const addr = this.location.address;
  const parts = [addr.street, addr.city, addr.state, addr.postal_code, addr.country]
    .filter(part => part && part.trim());
  
  return parts.join(', ');
});

storeSchema.virtual('distance').get(function() {
  return this._distance;
}).set(function(distance) {
  this._distance = distance;
});

storeSchema.pre('save', function(next) {
  if (this.isModified('store_name') && !this.slug) {
    this.slug = this.store_name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  
  this.updated_at = new Date();
  
  if (this.isModified('is_verified') && this.is_verified && !this.verification_date) {
    this.verification_date = new Date();
  }
  
  next();
});

storeSchema.statics.findNearby = function(longitude, latitude, maxDistance = 10000) {
  return this.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance 
      }
    },
    status: 'active',
    deleted_at: null
  });
};

storeSchema.statics.findWithinRadius = function(longitude, latitude, radius = 5000) {
  return this.find({
    location: {
      $geoWithin: {
        $centerSphere: [[longitude, latitude], radius / 6378100] 
      }
    },
    status: 'active',
    deleted_at: null
  });
};

storeSchema.methods.updateRating = function(newRating, oldRating = null) {
  if (oldRating) {
    this.ratings[`${oldRating}_star`] = Math.max(0, this.ratings[`${oldRating}_star`] - 1);
  } else {
    this.ratings.total_reviews += 1;
  }
  
  this.ratings[`${newRating}_star`] += 1;
  
  const totalStars = (
    this.ratings.five_star * 5 +
    this.ratings.four_star * 4 +
    this.ratings.three_star * 3 +
    this.ratings.two_star * 2 +
    this.ratings.one_star * 1
  );
  
  this.ratings.average = this.ratings.total_reviews > 0 ? totalStars / this.ratings.total_reviews : 0;
  
  return this.save();
};

storeSchema.methods.softDelete = function() {
  this.deleted_at = new Date();
  this.status = 'inactive';
  return this.save();
};

storeSchema.methods.restore = function() {
  this.deleted_at = null;
  this.status = 'active';
  return this.save();
};

storeSchema.query.active = function() {
  return this.where({ status: 'active', deleted_at: null });
};

storeSchema.query.verified = function() {
  return this.where({ is_verified: true });
};

storeSchema.query.byCategory = function(category) {
  return this.where({ category });
};

module.exports = mongoose.model('Store', storeSchema);
