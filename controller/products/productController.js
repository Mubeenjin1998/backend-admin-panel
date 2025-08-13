
const ProductStoreInventory = require('../../models/master/productStoreInventoryModel')


const addproductInventory = async  (req, res) => {
  try {
    const {
      product_id,
      store_id,
      quantity,
      price,
      discounted_price,
      min_quantity,
      max_quantity,
      is_available
    } = req.body;

    // Basic validation
    if (!product_id || !store_id || quantity === undefined || !price) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: product_id, store_id, quantity, price'
      });
    }

    const inventory = new ProductStoreInventory(req.body);
    await inventory.save();

    const populatedInventory = await ProductStoreInventory.findById(inventory._id)
      .populate('product_id', 'name sku category')
      .populate('store_id', 'name location address');

    res.status(201).json({
      success: true,
      data: populatedInventory,
      message: 'Inventory created successfully'
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Inventory already exists for this product-store combination'
      });
    }
    res.status(400).json({
      success: false,
      error: error.message,
      message: 'Failed to create inventory'
    });
  }
};


const fetchInventory =  async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = '-created_at',
      store_id,
      product_id,
      is_available,
      min_quantity_filter,
      max_quantity_filter
    } = req.query;

    // Build filter object
    const filters = {};
    if (store_id) filters.store_id = store_id;
    if (product_id) filters.product_id = product_id;
    if (is_available !== undefined) filters.is_available = is_available === 'true';
    if (min_quantity_filter) filters.quantity = { $gte: parseInt(min_quantity_filter) };
    if (max_quantity_filter) {
      filters.quantity = { ...filters.quantity, $lte: parseInt(max_quantity_filter) };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const inventory = await ProductStoreInventory.find(filters)
      .populate('product_id', 'name sku category brand')
      .populate('store_id', 'name location address')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ProductStoreInventory.countDocuments(filters);

    res.json({
      success: true,
      data: inventory,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to fetch inventory'
    });
  }
};

const getproduductStoreInventory = async (req, res) => {
  try {
    const inventory = await ProductStoreInventory.findById(req.params.id)
      .populate('product_id', 'name sku category description brand')
      .populate('store_id', 'name location address contact');

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventory not found'
      });
    }

    res.json({
      success: true,
      data: inventory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to fetch inventory'
    });
  }
};

module.exports = { addproductInventory };



// router.get('/product/:productId/store/:storeId', async (req, res) => {
//   try {
//     const { productId, storeId } = req.params;

//     const inventory = await ProductStoreInventory.findOne({
//       product_id: productId,
//       store_id: storeId
//     })
//       .populate('product_id', 'name sku category')
//       .populate('store_id', 'name location');

//     if (!inventory) {
//       return res.status(404).json({
//         success: false,
//         message: 'Inventory not found for this product-store combination'
//       });
//     }

//     res.json({
//       success: true,
//       data: inventory
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message,
//       message: 'Failed to fetch inventory'
//     });
//   }
// });

// router.get('/store/:storeId', async (req, res) => {
//   try {
//     const { storeId } = req.params;
//     const { is_available, low_stock } = req.query;

//     const filters = { store_id: storeId };
//     if (is_available !== undefined) filters.is_available = is_available === 'true';

//     let inventory = await ProductStoreInventory.find(filters)
//       .populate('product_id', 'name sku category brand')
//       .sort({ updated_at: -1 });

//     // Filter for low stock if requested
//     if (low_stock === 'true') {
//       inventory = inventory.filter(item => item.quantity <= item.min_quantity);
//     }

//     res.json({
//       success: true,
//       data: inventory,
//       count: inventory.length
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message,
//       message: 'Failed to fetch store inventory'
//     });
//   }
// });

// // READ - Get inventory by product across all stores
// // GET /api/inventory/product/:productId
// router.get('/product/:productId', async (req, res) => {
//   try {
//     const { productId } = req.params;

//     const inventory = await ProductStoreInventory.find({ product_id: productId })
//       .populate('store_id', 'name location address')
//       .sort({ quantity: -1 });

//     res.json({
//       success: true,
//       data: inventory,
//       count: inventory.length
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message,
//       message: 'Failed to fetch product inventory'
//     });
//   }
// });

// // PUT /api/inventory/:id
// router.put('/:id', validateObjectId, async (req, res) => {
//   try {
//     const inventory = await ProductStoreInventory.findByIdAndUpdate(
//       req.params.id,
//       { ...req.body, updated_at: Date.now() },
//       { new: true, runValidators: true }
//     )
//       .populate('product_id', 'name sku')
//       .populate('store_id', 'name location');

//     if (!inventory) {
//       return res.status(404).json({
//         success: false,
//         message: 'Inventory not found'
//       });
//     }

//     res.json({
//       success: true,
//       data: inventory,
//       message: 'Inventory updated successfully'
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       error: error.message,
//       message: 'Failed to update inventory'
//     });
//   }
// });

// // UPDATE - Update quantity
// // PATCH /api/inventory/:id/quantity
// router.patch('/:id/quantity', validateObjectId, async (req, res) => {
//   try {
//     const { quantity } = req.body;

//     if (quantity === undefined || quantity < 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Valid quantity is required'
//       });
//     }

//     const inventory = await ProductStoreInventory.findByIdAndUpdate(
//       req.params.id,
//       {
//         quantity,
//         updated_at: Date.now(),
//         is_available: quantity > 0
//       },
//       { new: true, runValidators: true }
//     )
//       .populate('product_id', 'name sku')
//       .populate('store_id', 'name location');

//     if (!inventory) {
//       return res.status(404).json({
//         success: false,
//         message: 'Inventory not found'
//       });
//     }

//     res.json({
//       success: true,
//       data: inventory,
//       message: 'Quantity updated successfully'
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       error: error.message,
//       message: 'Failed to update quantity'
//     });
//   }
// });
// // UPDATE - Restock inventory
// // PATCH /api/inventory/:id/restock
// router.patch('/:id/restock', validateObjectId, async (req, res) => {
//   try {
//     const { additional_quantity } = req.body;

//     if (!additional_quantity || additional_quantity <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Valid additional_quantity is required'
//       });
//     }

//     const inventory = await ProductStoreInventory.findById(req.params.id);

//     if (!inventory) {
//       return res.status(404).json({
//         success: false,
//         message: 'Inventory not found'
//       });
//     }

//     inventory.quantity += additional_quantity;
//     inventory.last_restocked = Date.now();
//     inventory.is_available = inventory.quantity > 0;
//     inventory.updated_at = Date.now();

//     await inventory.save();

//     const populatedInventory = await ProductStoreInventory.findById(inventory._id)
//       .populate('product_id', 'name sku')
//       .populate('store_id', 'name location');

//     res.json({
//       success: true,
//       data: populatedInventory,
//       message: `Restocked ${additional_quantity} units successfully`
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message,
//       message: 'Failed to restock inventory'
//     });
//   }
// });

// // UPDATE - Bulk update inventory
// // PATCH /api/inventory/bulk-update
// router.patch('/bulk-update', async (req, res) => {
//   try {
//     const { updates } = req.body;

//     if (!Array.isArray(updates) || updates.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Updates array is required'
//       });
//     }

//     const bulkOps = updates.map(update => ({
//       updateOne: {
//         filter: {
//           product_id: update.product_id,
//           store_id: update.store_id
//         },
//         update: {
//           ...update.data,
//           updated_at: Date.now()
//         },
//         upsert: update.upsert || false
//       }
//     }));

//     const result = await ProductStoreInventory.bulkWrite(bulkOps);

//     res.json({
//       success: true,
//       data: result,
//       message: `Bulk update completed. Modified: ${result.modifiedCount}, Inserted: ${result.upsertedCount}`
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message,
//       message: 'Bulk update failed'
//     });
//   }
// });

// // DELETE - Delete inventory by ID
// // DELETE /api/inventory/:id
// router.delete('/:id', validateObjectId, async (req, res) => {
//   try {
//     const inventory = await ProductStoreInventory.findByIdAndDelete(req.params.id);

//     if (!inventory) {
//       return res.status(404).json({
//         success: false,
//         message: 'Inventory not found'
//       });
//     }

//     res.json({
//       success: true,
//       data: inventory,
//       message: 'Inventory deleted successfully'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message,
//       message: 'Failed to delete inventory'
//     });
//   }
// });

// // / DELETE - Delete inventory by product and store
// // DELETE /api/inventory/product/:productId/store/:storeId
// router.delete('/product/:productId/store/:storeId', async (req, res) => {
//   try {
//     const { productId, storeId } = req.params;

//     const inventory = await ProductStoreInventory.findOneAndDelete({
//       product_id: productId,
//       store_id: storeId
//     });

//     if (!inventory) {
//       return res.status(404).json({
//         success: false,
//         message: 'Inventory not found for this product-store combination'
//       });
//     }

//     res.json({
//       success: true,
//       data: inventory,
//       message: 'Inventory deleted successfully'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message,
//       message: 'Failed to delete inventory'
//     });
//   }
// });

// // DELETE - Delete all inventory for a store
// // DELETE /api/inventory/store/:storeId
// router.delete('/store/:storeId', async (req, res) => {
//   try {
//     const { storeId } = req.params;
//     const { confirm } = req.query;

//     if (confirm !== 'true') {
//       return res.status(400).json({
//         success: false,
//         message: 'Add ?confirm=true to confirm deletion of all store inventory'
//       });
//     }

//     const result = await ProductStoreInventory.deleteMany({ store_id: storeId });

//     res.json({
//       success: true,
//       data: { deletedCount: result.deletedCount },
//       message: `Deleted ${result.deletedCount} inventory records for store`
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message,
//       message: 'Failed to delete store inventory'
//     });
//   }
// });
// // UTILITY - Get low stock items
// // GET /api/inventory/reports/low-stock?store_id=xxx&threshold=5
// router.get('/reports/low-stock', async (req, res) => {
//   try {
//     const { store_id, threshold } = req.query;

//     let query = { is_available: true };
//     if (store_id) query.store_id = store_id;

//     const inventory = await ProductStoreInventory.find(query)
//       .populate('product_id', 'name sku')
//       .populate('store_id', 'name location');

//     const lowStockItems = inventory.filter(item => {
//       const minThreshold = threshold ? parseInt(threshold) : item.min_quantity;
//       return item.quantity <= minThreshold;
//     });

//     res.json({
//       success: true,
//       data: lowStockItems,
//       count: lowStockItems.length
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message,
//       message: 'Failed to fetch low stock items'
//     });
//   }
// });

// // UTILITY - Get out of stock items
// // GET /api/inventory/reports/out-of-stock?store_id=xxx
// router.get('/reports/out-of-stock', async (req, res) => {
//   try {
//     const { store_id } = req.query;

//     let query = { quantity: 0 };
//     if (store_id) query.store_id = store_id;

//     const inventory = await ProductStoreInventory.find(query)
//       .populate('product_id', 'name sku')
//       .populate('store_id', 'name location');

//     res.json({
//       success: true,
//       data: inventory,
//       count: inventory.length
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message,
//       message: 'Failed to fetch out of stock items'
//     });
//   }
// });

// router.get('/reports/summary', async (req, res) => {
//   try {
//     const { store_id } = req.query;

//     let matchQuery = {};
//     if (store_id) matchQuery.store_id = store_id;

//     const summary = await ProductStoreInventory.aggregate([
//       { $match: matchQuery },
//       {
//         $group: {
//           _id: null,
//           totalProducts: { $sum: 1 },
//           totalQuantity: { $sum: '$quantity' },
//           availableProducts: {
//             $sum: { $cond: [{ $eq: ['$is_available', true] }, 1, 0] }
//           },
//           outOfStockProducts: {
//             $sum: { $cond: [{ $eq: ['$quantity', 0] }, 1, 0] }
//           },
//           totalValue: { $sum: { $multiply: ['$quantity', '$price'] } },
//           averagePrice: { $avg: '$price' }
//         }
//       }
//     ]);

//     res.json({
//       success: true,
//       data: summary[0] || {
//         totalProducts: 0,
//         totalQuantity: 0,
//         availableProducts: 0,
//         outOfStockProducts: 0,
//         totalValue: 0,
//         averagePrice: 0
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message,
//       message: 'Failed to generate summary'
//     });
//   }
// });