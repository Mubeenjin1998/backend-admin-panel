// const mongoose = require('mongoose');

// const categorySchema = new mongoose.Schema({
//   category_name: {
//     type: String,
//     required: true,
//     maxlength: 100
//   },
//   category_description: {
//     type: String
//   },
//   is_active: {
//     type: Boolean,
//     default: true
//   },
//   image_url: {
//     type: String,
//     maxlength: 255
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

// categorySchema.pre('save', function(next) {
//   this.updated_at = Date.now();
//   next();
// });

// module.exports = mongoose.model('Category', categorySchema);

const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 255
  },
  description: {
    type: String
  },
  image_url: {
    type: String,
    maxlength: 500
  },
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null 
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 255
  },
  sort_order: {
    type: Number,
    default: 0
  },
  level: {
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


function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') 
    .replace(/[\s_-]+/g, '-') 
    .replace(/^-+|-+$/g, ''); 
}

categorySchema.pre('save', async function(next) {
  
  if (!this.slug || this.isModified('name')) {
    let baseSlug = generateSlug(this.name);
    let slug = baseSlug;
    let counter = 1;
    
    while (await this.constructor.findOne({ slug: slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.slug = slug;
  }
  
  if (this.isModified('parent_id')) {
    if (!this.parent_id) {
      this.level = 0;
    } else {
      const parent = await this.constructor.findById(this.parent_id);
      this.level = parent ? parent.level + 1 : 0;
    }
  }
  
  next();
});

categorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent_id'
});

categorySchema.virtual('parent', {
  ref: 'Category',
  localField: 'parent_id',
  foreignField: '_id',
  justOne: true
});

categorySchema.methods.isMainCategory = function() {
  return this.parent_id === null;
};

categorySchema.statics.findMainCategories = function() {
  return this.find({ parent_id: null, is_active: true })
             .sort({ sort_order: 1, name: 1 });
};

categorySchema.statics.findSubcategories = function(parentId) {
  return this.find({ parent_id: parentId, is_active: true })
             .sort({ sort_order: 1, name: 1 });
};

categorySchema.statics.getCategoryTree = async function() {
  const categories = await this.find({ is_active: true })
                              .sort({ sort_order: 1, name: 1 });
  
  const buildTree = (parentId = null) => {
    return categories
      .filter(cat => String(cat.parent_id) === String(parentId))
      .map(cat => ({
        ...cat.toObject(),
        children: buildTree(cat._id)
      }));
  };
  
  return buildTree();
};

// categorySchema.methods.getPath = async function() {
//   const path = [];
//   let current = this;
  
//   while (current) {
//     path.unshift({
//       _id: current._id,
//       name: current.name,
//       slug: current.slug
//     });
    
//     if (current.parent_id) {
//       current = await this.constructor.findById(current.parent_id);
//     } else {
//       current = null;
//     }
//   }
  
//   return path;
// };

// categorySchema.methods.getAllDescendants = async function() {
//   const descendants = [];
//   const queue = [this._id];
  
//   while (queue.length > 0) {
//     const currentId = queue.shift();
//     const children = await this.constructor.find({ parent_id: currentId });
    
//     for (const child of children) {
//       descendants.push(child);
//       queue.push(child._id);
//     }
//   }
  
//   return descendants;
// };

categorySchema.index({ slug: 1 });
categorySchema.index({ parent_id: 1 });
categorySchema.index({ sort_order: 1 });
categorySchema.index({ is_active: 1 });
categorySchema.set('toJSON', { virtuals: true });
categorySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Category', categorySchema);
