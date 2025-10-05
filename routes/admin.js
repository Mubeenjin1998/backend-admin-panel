const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Product = require('../models/Product');
const Analytics = require('../models/Analytics');
const upload = require('../middleware/upload');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const { verifyToken, adminOnly, optionalAuth } = require('../middleware/auth');
const variantAttributeModel = require('../models/master/variantAttributeModel');
const variantAttributeValueModel = require('../models/master/variantAttributeValueModel');
const productVariantModel = require('../models/master/productVariantModel');
const { default: mongoose } = require('mongoose');



// const verifyToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) return res.status(401).json({ message: 'No token provided' });

//   const token = authHeader.split(' ')[1];
//   if (!token) return res.status(401).json({ message: 'No token provided' });

//   jwt.verify(token, JWT_SECRET, (err, decoded) => {
//     if (err) return res.status(401).json({ message: 'Invalid token' });
//     if (decoded.role !== 'admin') return res.status(403).json({ message: 'Forbidden: Admins only' });
//     req.user = decoded;
//     next();
//   });
// };

router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email and password are required' });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, role: role || 'admin' });
    const savedUser = await newUser.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/login', async (req, res) => {

  console.log('Login attempt:', req.body);
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({
      status: false,
      message: 'Invalid credentials'
    });

    console.log('User found:', user);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    if (user.role !== 'admin') return res.status(403).json({ message: 'Forbidden: Admins only' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({
      success: true,
      message: "admin login successfully",
      token: token,
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.get('/users', verifyToken, adminOnly, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    let searchCondition = { createdBy: req.user.id };
    if (search) {
      searchCondition.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await User.countDocuments(searchCondition);
    const users = await User.find(searchCondition)
      .select('-__v -password')
      .skip(skip)
      .limit(limit);

    res.json({
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/users', verifyToken, async (req, res) => {
  console.log('Creating user:', req.body);
  console.log(req.user, '----------------------------------------')
  const { username, email, role, password } = req.body;
  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, role, password: hashedPassword, createdBy: req.user.id });
    const savedUser = await newUser.save();
    const userResponse = savedUser.toObject();
    delete userResponse.password;
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error: error.message });
  }
});


router.get('/users/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({
      success: false,
      message: 'User not found'
    });
    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/users/:id', verifyToken, async (req, res) => {
  const { username, email, role } = req.body;
  const id = req.params.id;

  try {
    let findUser = await User.findById(id);
    if (!findUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check for duplicate username (if username is being updated)
    if (username && username !== findUser.username) {
      const duplicateUsername = await User.findOne({
        username: username,
        _id: { $ne: id }
      });

      if (duplicateUsername) {
        return res.status(409).json({
          success: false,
          message: 'Username already exists'
        });
      }
    }

    // Check for duplicate email (if email is being updated)
    if (email && email !== findUser.email) {
      const duplicateEmail = await User.findOne({
        email: email,
        _id: { $ne: id }
      });

      if (duplicateEmail) {
        return res.status(409).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(id, {
      username, email, role
    }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userResponse = updatedUser.toObject();
    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: userResponse
    });

  } catch (error) {
    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      const duplicateField = error.message.includes('username') ? 'username' :
        error.message.includes('email') ? 'email' : 'field';

      return res.status(409).json({
        success: false,
        message: `${duplicateField.charAt(0).toUpperCase() + duplicateField.slice(1)} already exists`
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: error.message
      });
    }

    // Handle cast errors
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid data format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const removedUser = await User.findByIdAndDelete(req.params.id);
    if (!removedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

//==================================================

router.get('/products', optionalAuth, async (req, res) => {
  console.log(req.user, '=================products===================')
  try {
    const { search = '', page = 1, limit = 40, category_id, subcategory_id } = req.query;

    const pageNumber = Math.max(1, parseInt(page) || 1);
    const limitNumber = Math.max(1, Math.min(100, parseInt(limit) || 40));
    const skip = (pageNumber - 1) * limitNumber;

    const andConditions = [];

    if (search) {
      andConditions.push({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      });
    }

    if (category_id) andConditions.push({ category_id: new mongoose.Types.ObjectId(category_id) });
    if (subcategory_id) andConditions.push({ subcategory_id: new mongoose.Types.ObjectId(subcategory_id) });

    const searchCondition = andConditions.length > 0 ? { $and: andConditions } : {};

    if (req.user) {
      searchCondition.createdBy = new mongoose.Types.ObjectId(req.user.id);
    }

    const pipeline = [
      { $match: searchCondition },

      {
        $lookup: {
          from: "productstoreinventories",
          localField: "_id",
          foreignField: "product_id",
          as: "storeInventory"
        }
      },

    

      { $unwind: { path: "$storeInventory", preserveNullAndEmptyArrays: true } },
        {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category"
        }

      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },


      {
        $addFields: {
          "storeInventory.total_variant_quantity": {
            $sum: {
              $map: {
                input: "$storeInventory.variants",
                as: "v",
                in: "$$v.quantity"
              }
            }
          }
        }
      },

      { $unwind: { path: "$storeInventory.variants", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "stores",
          localField:"storeInventory.store_id",
          foreignField: "_id",
          as: "storeInventory.storeDetails"
        }         
      },
      { $unwind: { path: "$storeInventory.storeDetails", preserveNullAndEmptyArrays: true } },


      {
        $addFields: {
          "storeInventory.quantity": "$storeInventory.base_inventory.quantity",
          "storeInventory.store_name": "$storeInventory.storeDetails.store_name",
          "storeInventory.location" :"$storeInventory.storeDetails.location.address",
          "storeInventory.reserved_quantity": "$storeInventory.base_inventory.reserved_quantity",
          "storeInventory.min_quantity": "$storeInventory.base_inventory.min_quantity",
          "storeInventory.max_quantity": "$storeInventory.base_inventory.max_quantity",
          "storeInventory.low_stock_threshold": "$storeInventory.base_inventory.low_stock_threshold",
          "storeInventory.is_available": "$storeInventory.base_inventory.is_available",
          "storeInventory.last_restocked": "$storeInventory.base_inventory.last_restocked",


        }
      },

      {
        $project: {
          "storeInventory.base_inventory": 0,
          "storeInventory.storeDetails":0
          // "storeInventory.variants": 0
        }
      },
      {
        $lookup: {
          from: "productvariants",
          localField: "storeInventory.variants.variant_id",
          foreignField: "_id",
          as: "variantDetails"
        }
      },
      { $unwind: { path: "$variantDetails", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          "storeInventory.base_price": "$variantDetails.base_price",

        }
      },

      {
        $project: {
          "variantDetails": 0
        }
      },
      { $sort: { createdAt: -1, "storeInventory.created_at": 1 } },
      { $skip: skip },
      { $limit: limitNumber }
    ];

    const totalCountPipeline = [
      { $match: searchCondition },
      { $count: "total" }
    ];

    const totalResult = await Product.aggregate(totalCountPipeline);
    const total = totalResult.length > 0 ? totalResult[0].total : 0;

    const products = await Product.aggregate(pipeline);

    console.log(products, '=================products===================')

    const formattedProducts = products.map(p => ({
      _id: p._id,
      name: p.name,
      description: p.description,
      category:{
      category_id: p.category_id,
      category_name: p.category.name,
      },
     
      subcategory_id: p.subcategory_id,
      brand_id: p.brand_id,

      price: p.storeInventory?.base_price ?? p.price,

      createdBy: req.user ? p.createdBy : undefined,
      imageUrl: p.imageUrl || [],
      status: p.status,
      isActive: p.isActive,
      createdAt: p.createdAt,

      store: p.storeInventory?.store_id != null
        ? (p.storeInventory?.variants
          ? {
            store_id: p.storeInventory.store_id,
            store_name: p.storeInventory.store_name || '',
            quantity: p.storeInventory?.total_variant_quantity || 0,
            isAvailable: p.storeInventory?.is_available !== false,
            location: p.storeInventory?.location || {},


          }
          : {
            store_id: p.storeInventory.store_id,
            store_name: p.storeInventory.store_name || '',
            location: p.storeInventory?.location || {},

            quantity: p.storeInventory?.quantity || 0,
            isAvailable: p.storeInventory?.is_available !== false,
          })
        : undefined
    }));

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: products.length ? "Products retrieved successfully" : "No products found",
      products: formattedProducts,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),


    });

  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Server error",
      error: error.message
    });
  }
});


router.get('/products/:id', verifyToken, async (req, res) => {

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Product not found'
      });
    }
    const baseurl = `${req.protocol}://${req.hostname}:${req.app.get('port') || 5000}/uploads`;

    const formattedProduct = {
      ...product.toObject(),
      imageUrl: product.imageUrl
        ? product.imageUrl.map(item => `${baseurl}/${item}`)
        : []
    };

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Product retrieved successfully',
      product: formattedProduct
    });
  }
  catch (error) {
    console.error('Error retrieving product:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Server error',
      error: error.message
    });
  }
});

router.post(
  '/products',
  verifyToken,
  upload("product").array('images', 5),
  async (req, res) => {
    try {
      const {
        product_id,
        name,
        description,
        price,
        category_id,
        subcategory_id,
        brand_id,
      } = req.body;

      let variant = req.body.variant;

      if (variant !== undefined && variant !== null) {
        if (typeof variant === 'string') {
          if (variant.trim() === '') {
            variant = null;
          } else {
            try {
              variant = JSON.parse(variant);
            } catch (e) {
              return res.status(400).json({
                success: false,
                message: 'Invalid JSON in "variant". Please provide valid JSON format.',
                debug: `Received: ${variant}`,
              });
            }
          }
        }
      }

      const {
        sku,
        variant_name,
        attributes: rawAttributes,
        base_price,
        weight,
      } = variant || {};

      let attributes = rawAttributes;
      if (attributes !== undefined && attributes !== null) {
        if (typeof attributes === 'string') {
          if (attributes.trim() === '') {
            attributes = null;
          } else {
            try {
              attributes = JSON.parse(attributes);
            } catch (e) {
              return res.status(400).json({
                success: false,
                message: 'Invalid JSON in "variant.attributes". Please provide valid JSON format.',
                debug: `Received: ${attributes}`,
              });
            }
          }
        }
      }

      // const imageUrl = (req.files || []).map(f => f.filename);

      const protocol = req.protocol; // http or https
      const host = req.get('Host'); // hostname with port
      const imageUrl = (req.files || []).map(file =>
        `${protocol}://${host}/uploads/product/${file.filename}`
      );

      if (!product_id && (!name || !price || !category_id)) {
        return res.status(400).json({
          success: false,
          message: 'Required fields: name, price, category_id',
        });
      }

      let product;
      if (product_id) {
        product = await Product.findById(product_id);
        if (!product) {
          return res.status(404).json({
            success: false,
            message: 'Product not found',
          });
        }

        if (name) product.name = name;
        if (description) product.description = description;
        if (price !== undefined) product.price = price;
        if (category_id) product.category_id = category_id;
        if (subcategory_id) product.subcategory_id = subcategory_id;
        if (brand_id) product.brand_id = brand_id;
        if (imageUrl.length) product.imageUrl = imageUrl;

        await product.save();
      } else {
        product = new Product({
          name,
          description,
          price,
          category_id,
          subcategory_id,
          brand_id,
          imageUrl,
          createdBy: req.user.id,
        });
        await product.save();
      }

      let variantResponse = null;
      if (sku) {
        if (Array.isArray(attributes) && attributes.length > 0) {
          for (const attr of attributes) {
            if (!attr.attribute_id || !attr.value_id) {
              return res.status(400).json({
                success: false,
                message: 'Each attribute must have attribute_id and value_id',
              });
            }

            const attrExists = await variantAttributeModel.findById(attr.attribute_id);
            if (!attrExists) {
              return res.status(404).json({
                success: false,
                message: `VariantAttribute not found: ${attr.attribute_id}`,
              });
            }
            const valueExists = await variantAttributeValueModel.findById(attr.value_id);
            if (!valueExists) {
              return res.status(404).json({
                success: false,
                message: `VariantAttributeValue not found: ${attr.value_id}`,
              });
            }
          }
        }

        let pv = await productVariantModel.findOne({
          sku: sku.toUpperCase(),
          product_id: product._id,
        });

        if (pv) {
          if (variant_name) pv.variant_name = variant_name;
          if (attributes) pv.attributes = attributes;
          if (base_price !== undefined) pv.base_price = base_price;
          if (weight !== undefined) pv.weight = weight;
          if (imageUrl.length) pv.images = imageUrl;

          await pv.save();
          variantResponse = pv;
        } else {
          pv = new productVariantModel({
            product_id: product._id,
            sku: sku.toUpperCase(),
            variant_name,
            attributes,
            base_price,
            weight,
            images: imageUrl,
          });
          await pv.save();
          variantResponse = pv;
        }

        variantResponse = await productVariantModel.findById(variantResponse._id)
          .populate('product_id', 'name sku category')
          .populate('attributes.attribute_id', 'name display_name input_type')
          .populate('attributes.value_id', 'value display_value color_code');
      }

      return res.status(201).json({
        success: true,
        product,
        variant: variantResponse,
        message: product_id
          ? 'Product updated successfully'
          : sku
            ? 'Product and variant created successfully'
            : 'Product created successfully',
      });
    } catch (error) {
      console.error('Error creating/updating product & variant:', error);
      return res.status(400).json({
        success: false,
        message: 'Error creating/updating product & variant',
        error: error.message,
      });
    }
  }
);
//===============================================================================================
router.put(
  '/products/:id',
  verifyToken,
  upload("product").array('images', 5),
  async (req, res) => {
    console.log("this is product")
    try {
      const productId = req.params.id;

      let product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }

      let {
        name,
        description,
        price,
        stock,
        category_id,
        subcategory_id,
        brand_id,
        variant
      } = req.body;

      if (variant !== undefined && variant !== null) {
        if (typeof variant === 'string') {
          if (variant.trim() === '') {
            variant = null;
          } else {
            try {
              variant = JSON.parse(variant);
            } catch (e) {
              return res.status(400).json({
                success: false,
                message: 'Invalid JSON in "variant"',
                debug: e.message
              });
            }
          }
        }
      }

      const imageUrl = (req.files || []).map(f => f.filename);

      if (name !== undefined) product.name = name;
      if (description !== undefined) product.description = description;
      if (price !== undefined) product.price = price;
      if (stock !== undefined) product.stock = stock;
      if (category_id !== undefined) product.category_id = category_id;
      if (subcategory_id !== undefined) product.subcategory_id = subcategory_id;
      if (brand_id !== undefined) product.brand_id = brand_id;
      if (imageUrl.length > 0) product.imageUrl = imageUrl;

      await product.save();

      let variantResponse = null;
      if (variant && variant.sku) {
        let {
          sku,
          variant_name,
          attributes: rawAttributes,
          base_price,
          weight,
        } = variant;

        let attributes = rawAttributes;
        if (attributes !== undefined && attributes !== null) {
          if (typeof attributes === 'string') {
            try {
              attributes = JSON.parse(attributes);
            } catch (e) {
              return res.status(400).json({
                success: false,
                message: 'Invalid JSON in "variant.attributes"',
              });
            }
          }
        }

        if (Array.isArray(attributes)) {
          for (const attr of attributes) {
            if (!attr.attribute_id || !attr.value_id) {
              return res.status(400).json({
                success: false,
                message: 'Each attribute must have attribute_id and value_id',
              });
            }

            const attrExists = await variantAttributeModel.findById(attr.attribute_id);
            if (!attrExists) {
              return res.status(404).json({
                success: false,
                message: `VariantAttribute not found: ${attr.attribute_id}`,
              });
            }

            const valueExists = await variantAttributeValueModel.findById(attr.value_id);
            if (!valueExists) {
              return res.status(404).json({
                success: false,
                message: `VariantAttributeValue not found: ${attr.value_id}`,
              });
            }
          }
        }

        let pv = await productVariantModel.findOne({
          sku: sku.toUpperCase(),
          product_id: productId,
        });

        if (pv) {
          if (variant_name !== undefined) pv.variant_name = variant_name;
          if (attributes !== undefined) pv.attributes = attributes;
          if (base_price !== undefined) pv.base_price = base_price;
          if (weight !== undefined) pv.weight = weight;
          if (imageUrl.length > 0) pv.images = imageUrl;

          await pv.save();
          variantResponse = pv;
        } else {
          // ✅ Create new variant if not found
          pv = new productVariantModel({
            product_id: productId,
            sku: sku.toUpperCase(),
            variant_name,
            attributes,
            base_price,
            weight,
            images: imageUrl,
          });
          await pv.save();
          variantResponse = pv;
        }

        // Populate variant response
        variantResponse = await productVariantModel.findById(variantResponse._id)
          .populate('product_id', 'name sku category')
          .populate('attributes.attribute_id', 'name display_name input_type')
          .populate('attributes.value_id', 'value display_value color_code');
      }

      return res.status(200).json({
        success: true,
        product,
        variant: variantResponse,
        message: 'Product updated successfully',
      });
    } catch (error) {
      console.error('Error updating product & variant:', error);
      return res.status(500).json({
        success: false,
        message: 'Error updating product & variant',
        error: error.message,
      });
    }
  }
);
//===============================================================================================

// router.put('/products/:id', verifyToken, upload.array('images', 5), async (req, res) =>{
// try{
//   const { name, description, price, stock,category_id,
//       subcategory_id,
//       store_id } = req.body;
//   const id = req.params.id;
//   let imageUrl = [];
//   if (req.files && req.files.length > 0){
//     imageUrl = req.files.map((file)=>file.filename);
//   }

//   const existingProduct = await Product.findById(id);
// if (!existingProduct) {
//   return res.status(404).json({
//     success: false,
//     statusCode: 404,
//     message: 'Product not found'
//   });
// }


//   const  updateproduct = await Product.findByIdAndUpdate(id, {
//     name, 
//     description, 
//     price, 
//     stock,
//     category_id,
//     subcategory_id,
//     store_id, 
//     imageUrl: imageUrl.length > 0 ? imageUrl : existingProduct.imageUrl
//   }, { new: true });
//    if(!updateproduct){
//     return res.status(404).json({
//       success:false,
//       statusCode: 404,
//       message: 'Product not found'
//     });
//   }

//   return res.status(200).json({success:true,
//     statusCode: 200,
//     message: 'Product updated successfully',
//     product: {
//       ...updateproduct.toObject(),
//       imageUrl: updateproduct.imageUrl.map(item => `${req.protocol}://${req.hostname}:${req.app.get('port') || 5000}/uploads/${item}`)
//     }
//   });

// }catch(error) {
//   return res.status(500).json({ 
//     message: 'Error updating product',
//     error: error.message 
//   });
// }
//   })




router.delete('/products/:id', async (req, res) => {
  try {
    const removedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!removedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});






router.get('/analytics', async (req, res) => {
  try {
    const analytics = await Analytics.find().select('-__v');
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/analytics', async (req, res) => {
  const { metric, value, date } = req.body;
  try {
    const newAnalytics = new Analytics({ metric, value, date });
    const savedAnalytics = await newAnalytics.save();
    res.status(201).json(savedAnalytics);
  } catch (error) {
    res.status(400).json({ message: 'Error creating analytics data', error: error.message });
  }
});

module.exports = router;
