
const { Console } = require('winston/lib/winston/transports');
const categoryModel = require('../../models/master/categoryModel');
const ProductStoreInventory = require('../../models/master/productStoreInventoryModel')
const Product = require('../../models/Product')
const ProductVariant = require('../../models/master/productVariantModel')

const mongoose = require('mongoose');
const storeModel = require('../../models/master/storeModel');
const variantAttributeModel = require('../../models/master/variantAttributeModel');
const variantAttributeValueModel = require('../../models/master/variantAttributeValueModel');
const productStoreInventoryModel = require('../../models/master/productStoreInventoryModel');

const getAllProducts = async (req, res) => {
  try {
    const baseurl = `${req.protocol}://${req.hostname}:${req.app.get('port') || 5000}/uploads`;
    let { search = '', page = 1, limit = 5, category_id, store_id } = req.query;
    let { subcategory_id = [] } = req.body;

    if (!subcategory_id) subcategory_id = [];
    if (typeof subcategory_id === 'string') {
      try {
        subcategory_id = JSON.parse(subcategory_id);
      } catch {
        subcategory_id = subcategory_id.split(',').map(s => s.trim());
      }
    }
    if (!Array.isArray(subcategory_id)) subcategory_id = [subcategory_id];

    subcategory_id = subcategory_id
      .filter(id => mongoose.Types.ObjectId.isValid(id))
      .map(id => new mongoose.Types.ObjectId(id));

    const pageNumber = Math.max(1, parseInt(page) || 1);
    const limitNumber = Math.max(1, Math.min(100, parseInt(limit) || 5));
    const skip = (pageNumber - 1) * limitNumber;

    const searchCondition = {};
    const andConditions = [];

    if (search) {
      andConditions.push({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      });
    }

    if (category_id) {
      if (!mongoose.Types.ObjectId.isValid(category_id)) {
        return res.status(400).json({ success: false, message: "Invalid category_id" });
      }


      const getAllSubcategories = async (parentId) => {
        const subs = await categoryModel.find({ parent_id: parentId }).select('_id').lean();

        if (subs.length === 0) {
          return [parentId];
        }

        let leafIds = [];
        for (let sub of subs) {
          leafIds = leafIds.concat(await getAllSubcategories(sub._id));
        }
        return leafIds;
      };


      const allSubIds = await getAllSubcategories(category_id);

      if (allSubIds.length === 0) {
        return res.status(404).json({ success: false, message: "No subcategories found for this category" });
      }

      andConditions.push({ subcategory_id: { $in: allSubIds } });
    }

    if (subcategory_id.length > 0) {
      andConditions.push({ subcategory_id: { $in: subcategory_id } });
    }

    if (store_id) {
      if (!mongoose.Types.ObjectId.isValid(store_id)) {
        return res.status(400).json({ success: false, message: "Invalid store_id" });
      }
      andConditions.push({ store_id: new mongoose.Types.ObjectId(store_id) });
    }

    if (andConditions.length > 0) {
      searchCondition.$and = andConditions;
    }




    const total = await Product.countDocuments(searchCondition);

    const products = await Product.find(searchCondition)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .select('-__v');

    const formattedProducts = products.map(product => ({
      ...product.toObject(),
      imageUrl: product.imageUrl
        ? product.imageUrl.map(item => `${baseurl}/${item}`)
        : []
    }));

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: products.length ? 'Products retrieved successfully' : 'No products found',
      products: formattedProducts,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber)
    });

  } catch (error) {
    console.error('Error retrieving products:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Server error',
      error: error.message
    });
  }
};




const addProductVariant = async (req, res) => {
  // try {
  //   const {
  //     product_id,
  //     sku,
  //     variant_name,
  //     attributes,
  //     base_price,
  //     weight,
  //     images
  //   } = req.body;

  //   if (!product_id || !sku || !attributes || !Array.isArray(attributes) || attributes.length === 0) {
  //     return res.status(400).json({
  //       success: false,
  //       message: "Required fields: product_id, sku, attributes[]"
  //     });
  //   }

  //   const product = await Product.findById(product_id);
  //   if (!product) {
  //     return res.status(404).json({
  //       success: false,
  //       message: "Product not found"
  //     });
  //   }

  //   for (const attr of attributes) {
  //     const attrExists = await variantAttributeModel.findById(attr.attribute_id);
  //     if (!attrExists) {
  //       return res.status(404).json({
  //         success: false,
  //         message: `VariantAttribute not found: ${attr.attribute_id}`
  //       });
  //     }

  //     const valueExists = await variantAttributeValueModel.findById(attr.value_id);
  //     if (!valueExists) {
  //       return res.status(404).json({
  //         success: false,
  //         message: `VariantAttributeValue not found: ${attr.value_id}`
  //       });
  //     }
  //   }

  //   const existingVariant = await ProductVariant.findOne({ sku: sku.toUpperCase() });
  //   if (existingVariant) {
  //     return res.status(409).json({
  //       success: false,
  //       message: "SKU already exists"
  //     });
  //   }

  //   const variant = new ProductVariant({
  //     product_id,
  //     sku: sku.toUpperCase(),
  //     variant_name,
  //     attributes,
  //     base_price,
  //     weight,
  //     images
  //   });

  //   await variant.save();

  //   const populatedVariant = await ProductVariant.findById(variant._id)
  //     .populate("product_id", "name sku category")
  //     .populate("attributes.attribute_id", "name display_name input_type")
  //     .populate("attributes.value_id", "value display_value color_code");

  //   return res.status(201).json({
  //     success: true,
  //     data: populatedVariant,
  //     message: "Product variant created successfully"
  //   });

  // } catch (error) {
  //   console.error("Add Product Variant Error:", error);
  //   return res.status(500).json({
  //     success: false,
  //     error: error.message,
  //     message: "Failed to create product variant"
  //   });
  // }
  try {
    const {
      product_id,
      sku,
      variant_name,
      attributes,
      base_price,
      weight,
      images
    } = req.body;

    if (!product_id || !sku) {
      return res.status(400).json({
        success: false,
        message: "Required fields: product_id, sku"
      });
    }

    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (attributes && Array.isArray(attributes)) {
      for (const attr of attributes) {
        const attrExists = await variantAttributeModel.findById(attr.attribute_id);
        if (!attrExists) {
          return res.status(404).json({
            success: false,
            message: `VariantAttribute not found: ${attr.attribute_id}`
          });
        }

        const valueExists = await variantAttributeValueModel.findById(attr.value_id);
        if (!valueExists) {
          return res.status(404).json({
            success: false,
            message: `VariantAttributeValue not found: ${attr.value_id}`
          });
        }
      }
    }

    let variant = await ProductVariant.findOne({ sku: sku.toUpperCase(), product_id });

    if (variant) {
      if (variant_name) variant.variant_name = variant_name;
      if (attributes) variant.attributes = attributes;
      if (base_price !== undefined) variant.base_price = base_price;
      if (weight !== undefined) variant.weight = weight;
      if (images) variant.images = images;

      await variant.save();
    } else {
      variant = new ProductVariant({
        product_id,
        sku: sku.toUpperCase(),
        variant_name,
        attributes,
        base_price,
        weight,
        images
      });

      await variant.save();
    }

    const populatedVariant = await ProductVariant.findById(variant._id)
      .populate("product_id", "name sku category")
      .populate("attributes.attribute_id", "name display_name input_type")
      .populate("attributes.value_id", "value display_value color_code");

    return res.status(200).json({
      success: true,
      data: populatedVariant,
      message: variant.isNew ? "Product variant created successfully" : "Product variant updated successfully"
    });

  } catch (error) {
    console.error("Upsert Product Variant Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to upsert product variant"
    });
  }
};

// Convert string ID to ObjectId


// const getProductforInventory = async (req, res) => {

//   const baseUrl = `${req.protocol}://${req.get("host")}/uploads/`;

//   try {
//     const product_id = req.query.id;
//     if (!product_id) {
//       return res.status(400).json({ error: 'Product ID is required' });
//     }

//     const objectId = new mongoose.Types.ObjectId(product_id);
// const findProductWithVariant = await Product.aggregate([
//   {
//     $match: { _id: objectId }
//   },
//   {
//     $lookup: {
//       from: "productvariants",
//       localField: "_id",
//       foreignField: "product_id",
//       as: "productvariant"
//     }
//   },
//   {
//     $lookup: {
//       from: "categories",
//       localField: "category_id",
//       foreignField: "_id",
//       as: "category"
//     }
//   },
//   {
//     $lookup: {
//       from: "categories",  
//       localField: "subcategory_id",  
//       foreignField: "_id",
//       as: "subcategory"
//     }
//   },
//   { $unwind: { path: "$productvariant", preserveNullAndEmptyArrays: true } },
//   { $unwind: { path: "$productvariant.attributes", preserveNullAndEmptyArrays: true } },

//   {
//     $lookup: {
//       from: "variantattributes",
//       localField: "productvariant.attributes.attribute_id",
//       foreignField: "_id",
//       as: "attribute"
//     }
//   },
//   { $unwind: { path: "$attribute", preserveNullAndEmptyArrays: true } },

//   {
//     $lookup: {
//       from: "variantattributevalues",
//       localField: "productvariant.attributes.value_id",
//       foreignField: "_id",
//       as: "value"
//     }
//   },
//   { $unwind: { path: "$value", preserveNullAndEmptyArrays: true } },
//   {
//     $lookup: {
//       from: "productstoreinventories",
//       localField: "_id",
//       foreignField: "product_id",
//       as: "inventory"
//     }
//   },

//   {$unwind: { path: "$inventory", preserveNullAndEmptyArrays: true } },

//   {$lookup: { 
//     from: "stores",
//     localField: "inventory.store_id",
//     foreignField: "_id",
//     as: "inventory.store"
//   }},
//   { $unwind: { path: "$inventory.store", preserveNullAndEmptyArrays: true } },
// { 
//   $addFields: {
//     "inventory.store_name": "$inventory.store.store_name"
//   } 
// },
//   {
//     $project: {
//       "inventory.store": 0,
//   }
//   },

//   {
//     $group: {
//       _id: "$productvariant._id",
//       sku: { $first: "$productvariant.sku" },
//       variant_name: { $first: "$productvariant.variant_name" },
//       attributes: {
//         $push: {
//           attribute_id: "$attribute._id",
//           attribute: "$attribute.name",
//           value_id: "$value._id",
//           value: "$value.value"
//         }
//       },
//       productId: { $first: "$_id" },
//       productName: { $first: "$name" },
//       productImages: { $first: "$imageUrl" },
//       price: { $first: "$price" },
//       description: { $first: "$description" },
//       categoryId: { $first: { $arrayElemAt: ["$category._id", 0] } },
//       categoryName: { $first: { $arrayElemAt: ["$category.name", 0] } },
//       subcategoryId: { $first: { $arrayElemAt: ["$subcategory._id", 0] } },   
//       subcategoryName: { $first: { $arrayElemAt: ["$subcategory.name", 0] } } ,
//       inventory: {
//       $push: {
//         store_id: "$inventory.store_id",
//         storeName: "$inventory.store_name",
//         quantity: "$inventory.base_inventory.quantity",
//         // price: "$inventory.price"
//       }
//     }

//     }
//   },

// {
//   $group: {
//     _id: "$productId",
//     name: { $first: "$productName" },
//     images: { $first: "$productImages" },
//     price: { $first: "$price" },
//     description: { $first: "$description" },
//     category_id: { $first: "$categoryId" },
//     categoryName: { $first: "$categoryName" },
//     subcategory_id: { $first: "$subcategoryId" },     
//     subcategoryName: { $first: "$subcategoryName" }, 
//     productvariant: {
//       $push: {
//         _id: "$_id",
//         sku: "$sku",
//         variant_name: "$variant_name",
//         attributes: "$attributes",
//       }
//     },
//     // ✅ collect all inventories as array
//     inventory: { 
//       $push: {
//         store_id: "$inventory.store_id",
//         storeName: "$inventory.store_name",
//         quantity: "$inventory.base_inventory.quantity"
//         // price, gst etc bhi add kar sakte ho
//       }
//     }
//   }
// },

//  {
//   $addFields: {
//     productvariant: {
//       $filter: {
//         input: "$productvariant",
//         cond: { $ne: ["$$this._id", null] }
//       }
//     }
//   }
// },
// {
//   $addFields: {
//     productvariant: {
//       $cond: {
//         if: { $eq: [{ $size: "$productvariant" }, 0] },
//         then: null,
//         else: "$productvariant"
//       }
//     }
//   }
// }
// ]);



// let product = findProductWithVariant[0] || null;

// if (product) {
//   if (product.images && product.images.length > 0) {
//     product.image = product.images[0];
//   } else {
//     product.image = null;
//   }
//   delete product.images;
// }

// res.json({
//   success: true,
//   statusCode: 200,
//   product   
// });

//   } catch (error) {
//     console.error(error, 'Error in getProductforInventory');
//     return res.status(500).json({ error: 'Server error' });
//   }
// };

const getProductforInventory = async (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}/uploads/`;

  try {
    const product_id = req.query.id;
    if (!product_id) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const objectId = new mongoose.Types.ObjectId(product_id);

    const findProductWithVariant = await Product.aggregate([
      { $match: { _id: objectId } },

      {
        $lookup: {
          from: "productvariants",
          localField: "_id",
          foreignField: "product_id",
          as: "productvariant",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "subcategory_id",
          foreignField: "_id",
          as: "subcategory",
        },
      },

      { $unwind: { path: "$productvariant", preserveNullAndEmptyArrays: true } },
      {
        $unwind: {
          path: "$productvariant.attributes",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "variantattributes",
          localField: "productvariant.attributes.attribute_id",
          foreignField: "_id",
          as: "attribute",
        },
      },
      { $unwind: { path: "$attribute", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "variantattributevalues",
          localField: "productvariant.attributes.value_id",
          foreignField: "_id",
          as: "value",
        },
      },
      { $unwind: { path: "$value", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "productstoreinventories",
          localField: "_id",
          foreignField: "product_id",
          as: "inventory",
        },
      },
      { $unwind: { path: "$inventory", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "stores",
          localField: "inventory.store_id",
          foreignField: "_id",
          as: "inventory.store",
        },
      },
      { $unwind: { path: "$inventory.store", preserveNullAndEmptyArrays: true } },

      {
        $addFields: {
          "inventory.store_name": "$inventory.store.store_name",
        },
      },
      {
        $project: {
          "inventory.store": 0,
        },
      },

      // Group by variant
      {
        $group: {
          _id: "$productvariant._id",
          sku: { $first: "$productvariant.sku" },
          variant_name: { $first: "$productvariant.variant_name" },
          attributes: {
            $push: {
              attribute_id: "$attribute._id",
              attribute: "$attribute.name",
              value_id: "$value._id",
              value: "$value.value",
            },
          },
          productId: { $first: "$_id" },
          productName: { $first: "$name" },
          productImages: { $first: "$imageUrl" },
          price: { $first: "$price" },
          description: { $first: "$description" },
          categoryId: { $first: { $arrayElemAt: ["$category._id", 0] } },
          categoryName: { $first: { $arrayElemAt: ["$category.name", 0] } },
          subcategoryId: { $first: { $arrayElemAt: ["$subcategory._id", 0] } },
          subcategoryName: {
            $first: { $arrayElemAt: ["$subcategory.name", 0] },
          },
          // ✅ inventory push here itself
          inventory: {
            $push: {
              store_id: "$inventory.store_id",
              storeName: "$inventory.store_name",
              quantity: "$inventory.base_inventory.quantity",
              price: "$inventory.price",
              discountedPrice: "$inventory.discounted_price",
              lowStockThreshold: "$inventory.low_stock_threshold",
              gst: "$inventory.gst",
            },
          },
        },
      },

      // Group by product
      {
        $group: {
          _id: "$productId",
          name: { $first: "$productName" },
          images: { $first: "$productImages" },
          price: { $first: "$price" },
          description: { $first: "$description" },
          category_id: { $first: "$categoryId" },
          categoryName: { $first: "$categoryName" },
          subcategory_id: { $first: "$subcategoryId" },
          subcategoryName: { $first: "$subcategoryName" },
          productvariant: {
            $push: {
              _id: "$_id",
              sku: "$sku",
              variant_name: "$variant_name",
              attributes: "$attributes",
            },
          },
          // ✅ just merge inventory arrays from variants
          inventory: { $push: "$inventory" },
        },
      },

      // flatten inventory (because $push of array of arrays)
      {
        $addFields: {
          inventory: {
            $reduce: {
              input: "$inventory",
              initialValue: [],
              in: { $concatArrays: ["$$value", "$$this"] },
            },
          },
        },
      },

      // filter variants nulls
      {
        $addFields: {
          productvariant: {
            $filter: {
              input: "$productvariant",
              cond: { $ne: ["$$this._id", null] },
            },
          },
        },
      },
      {
        $addFields: {
          productvariant: {
            $cond: {
              if: { $eq: [{ $size: "$productvariant" }, 0] },
              then: null,
              else: "$productvariant",
            },
          },
        },
      },
    ]);

    let product = findProductWithVariant[0] || null;

    if (product) {
      if (product.images && product.images.length > 0) {
        product.image = product.images[0];
      } else {
        product.image = null;
      }
      delete product.images;
    }

    res.json({
      success: true,
      statusCode: 200,
      product,
    });
  } catch (error) {
    console.error(error, "Error in getProductforInventory");
    return res.status(500).json({ error: "Server error" });
  }
};


//================================================================================


// const addproductInventory = async (req, res) => {
//   try {
//     const {
//       product_id,
//       stores  
//     } = req.body;

//     if (!product_id || !stores || !Array.isArray(stores) || stores.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Required fields: product_id, stores (array)"
//       });
//     }

//     const findProduct = await Product.findById(product_id);
//     if (!findProduct) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found"
//       });
//     }

//     const results = [];
//     const errors = [];

//     for (let i = 0; i < stores.length; i++) {
//       const storeData = stores[i];

//       try {
//         const {
//           store_id,
//           base_inventory,
//           variants
//         } = storeData;

//         if (!store_id) {
//           errors.push({
//             store_index: i,
//             error: "store_id is required for each store"
//           });
//           continue;
//         }

//         const findStore = await storeModel.findOne({ 
//           _id: store_id, 
//           status: "active" 
//         });

//         if (!findStore) {
//           errors.push({
//             store_index: i,
//             store_id,
//             error: "Store not found or inactive"
//           });
//           continue;
//         }

//         let inventory = await ProductStoreInventory.findOne({ 
//           product_id, 
//           store_id 
//         });

//         if (!inventory) {
//           inventory = new ProductStoreInventory({ 
//             product_id, 
//             store_id 
//           });
//         }

//         const wasNew = inventory.isNew;

//         if (base_inventory) {


//           if (!base_inventory.price === undefined || base_inventory.quantity === undefined) {
//             errors.push({
//               store_index: i,
//               store_id,
//               error: "Required fields for base inventory: quantity, price"
//             });
//             continue;
//           }

//           inventory.base_inventory = {
//             quantity: base_inventory.quantity,
//             reserved_quantity: base_inventory.reserved_quantity || 0,
//             discounted_price: base_inventory.discounted_price || null,
//             low_stock_threshold: base_inventory.low_stock_threshold || 5,
//             is_available: base_inventory.is_available !== undefined ? base_inventory.is_available : true,
//             last_restocked: new Date()
//           };
//         }else{
//           // inventory.base_inventory = inventory.base_inventory || {};
//           inventory.base_inventory = {};

//         }

//         if (variants && Array.isArray(variants)) {
//           for (const variantData of variants) {
//             if (!variantData.variant_id || variantData.quantity === undefined) {
//               errors.push({
//                 store_index: i,
//                 store_id,
//                 variant_error: "Required fields for variants: variant_id, sku, quantity, price"
//               });
//               continue;
//             }

//             const variantExists = await ProductVariant.findById(variantData.variant_id);
//             if (!variantExists) {
//               return res.status(404).json({
//                 success: false,
//                 message: `Product variant not found: ${variantData.variant_id}`
//               });
//             }



//             const existingVariantIndex = inventory.variants.findIndex(
//               item => item.variant_id.toString() === variantData.variant_id
//             );

//             const variantInventoryData = {
//               variant_id: variantData.variant_id,
//               quantity: variantData.quantity,
//               reserved_quantity: variantData.reserved_quantity || 0,
//               discounted_price: variantData.discounted_price || null,
//               low_stock_threshold: variantData.low_stock_threshold || 5,
//               is_available: variantData.is_available !== undefined ? variantData.is_available : true,
//               last_restocked: new Date()
//             };

//             if (existingVariantIndex > -1) {
//               inventory.variants[existingVariantIndex] = variantInventoryData;
//             } else {
//               inventory.variants.push(variantInventoryData);
//             }
//           }
//         }else{
//           // inventory.variants = inventory.variants || [];
//           inventory.variants = [];

//         }

//         if (!base_inventory && (!variants || variants.length === 0)) {

//           return res.status(400).json({
//             success: false,
//             message: "Either base_inventory or variants must be provided"
//           });

//         }

//         await inventory.save();
//         findProduct.status = 'completed';
//         await findProduct.save();

//         const populatedInventory = await ProductStoreInventory.findById(inventory._id)
//           .populate("product_id", "name sku category description")


//           console.log(populatedInventory,'=================populatedInventory===================')


//         results.push({
//           store_id,
//           store_name: findStore.name,
//           inventory: populatedInventory,
//           action: wasNew ? "created" : "updated"
//         });

//       } catch (storeError) {
//         console.error(`Error processing store ${storeData.store_id}:`, storeError);
//         return res.status(500).json({
//           success: false,
//           error: storeError.message,
//           message: "Failed to process inventory - Server error"
//         });

//       }
//     }

//     const totalStores = stores.length;
//     const successfulStores = results.length;
//     const failedStores = errors.length;

//     if (successfulStores === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Failed to process inventory for all stores",
//         errors,
//         summary: {
//           total: totalStores,
//           successful: 0,
//           failed: failedStores
//         }
//       });
//     } else if (failedStores === 0) {
//       return res.status(201).json({
//         success: true,
//         message: `Inventory processed successfully for all ${successfulStores} stores`,
//         data: results,
//         summary: {
//           total: totalStores,
//           successful: successfulStores,
//           failed: 0
//         }
//       });
//     } else {
//       return res.status(207).json({ 
//         success: true,
//         message: `Inventory processed for ${successfulStores} out of ${totalStores} stores`,
//         data: results,
//         errors,
//         summary: {
//           total: totalStores,
//           successful: successfulStores,
//           failed: failedStores
//         }
//       });
//     }

//   } catch (error) {
//     console.error("Add Product Inventory Error:", error);
//     return res.status(500).json({
//       success: false,
//       error: error.message,
//       message: "Failed to process inventory - Server error"
//     });
//   }
// };
const addproductInventory = async (req, res) => {
  try {
    const { product_id, stores } = req.body;

    if (!product_id || !Array.isArray(stores) || stores.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Required fields: product_id, stores (array)"
      });
    }

    const findProduct = await Product.findById(product_id);
    if (!findProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const results = [];
    const errors = [];

    const incomingStoreIds = stores.map(s => s.store_id);

    await ProductStoreInventory.deleteMany({
      product_id,
      store_id: { $nin: incomingStoreIds }
    });

    for (let i = 0; i < stores.length; i++) {
      const storeData = stores[i];

      try {
        const { store_id, base_inventory, variants } = storeData;

        if (!store_id) {
          errors.push({
            store_index: i,
            error: "store_id is required for each store"
          });
          continue;
        }

        const findStore = await storeModel.findOne({
          _id: store_id,
          status: "active"
        });

        if (!findStore) {
          errors.push({
            store_index: i,
            store_id,
            error: "Store not found or inactive"
          });
          continue;
        }

        let inventory = await ProductStoreInventory.findOne({
          product_id,
          store_id
        });
        if (!inventory) {
          inventory = new ProductStoreInventory({ product_id, store_id });
        }

        const wasNew = inventory.isNew;

        if (base_inventory) {
          if (
            base_inventory.price === undefined ||
            base_inventory.quantity === undefined
          ) {
            errors.push({
              store_index: i,
              store_id,
              error: "Required fields for base inventory: quantity, price"
            });
            continue;
          }

          inventory.base_inventory = {
            quantity: base_inventory.quantity,
            reserved_quantity: base_inventory.reserved_quantity || 0,
            price: base_inventory.price,
            discounted_price: base_inventory.discounted_price || null,
            low_stock_threshold: base_inventory.low_stock_threshold || 5,
            is_available:
              base_inventory.is_available !== undefined
                ? base_inventory.is_available
                : true,
            last_restocked: new Date()
          };
        } else {
          inventory.base_inventory = {};
        }

        if (variants && Array.isArray(variants)) {
          inventory.variants = []; // reset for clean update

          for (const variantData of variants) {
            if (
              !variantData.variant_id ||
              variantData.quantity === undefined ||
              variantData.price === undefined
            ) {
              errors.push({
                store_index: i,
                store_id,
                variant_error:
                  "Required fields for variants: variant_id, quantity, price"
              });
              continue;
            }

            const variantExists = await ProductVariant.findById(
              variantData.variant_id
            );
            if (!variantExists) {
              return res.status(404).json({
                success: false,
                message: `Product variant not found: ${variantData.variant_id}`
              });
            }

            inventory.variants.push({
              variant_id: variantData.variant_id,
              quantity: variantData.quantity,
              reserved_quantity: variantData.reserved_quantity || 0,
              price: variantData.price,
              discounted_price: variantData.discounted_price || null,
              low_stock_threshold: variantData.low_stock_threshold || 5,
              is_available:
                variantData.is_available !== undefined
                  ? variantData.is_available
                  : true,
              last_restocked: new Date()
            });
          }
        } else {
          inventory.variants = [];
        }

        if (!base_inventory && (!variants || variants.length === 0)) {
          return res.status(400).json({
            success: false,
            message: "Either base_inventory or variants must be provided"
          });
        }

        await inventory.save();

        // ✅ update product status
        findProduct.status = "completed";
        await findProduct.save();

        const populatedInventory = await ProductStoreInventory.findById(
          inventory._id
        ).populate("product_id", "name sku category description");

        results.push({
          store_id,
          store_name: findStore.name,
          inventory: populatedInventory,
          action: wasNew ? "created" : "updated"
        });
      } catch (storeError) {
        console.error(
          `Error processing store ${storeData.store_id}:`,
          storeError
        );
        return res.status(500).json({
          success: false,
          error: storeError.message,
          message: "Failed to process inventory - Server error"
        });
      }
    }

    const totalStores = stores.length;
    const successfulStores = results.length;
    const failedStores = errors.length;

    if (successfulStores === 0) {
      return res.status(400).json({
        success: false,
        message: "Failed to process inventory for all stores",
        errors,
        summary: { total: totalStores, successful: 0, failed: failedStores }
      });
    } else if (failedStores === 0) {
      return res.status(201).json({
        success: true,
        message: `Inventory processed successfully for all ${successfulStores} stores`,
        data: results,
        summary: { total: totalStores, successful: successfulStores, failed: 0 }
      });
    } else {
      return res.status(207).json({
        success: true,
        message: `Inventory processed for ${successfulStores} out of ${totalStores} stores`,
        data: results,
        errors,
        summary: { total: totalStores, successful: successfulStores, failed: failedStores }
      });
    }
  } catch (error) {
    console.error("Add Product Inventory Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "Failed to process inventory - Server error"
    });
  }
};





//===============================================================================

const fetchInventory = async (req, res) => {
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
      .populate({
        path: 'product_id',
        select: 'name sku brand category_id',
        populate: {
          path: 'category_id',
          select: 'name',
        }
      })
      .populate('store_id', 'store_name location address')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    console.log(inventory, '==============================same')

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

const getproductStoreInventory = async (req, res) => {

  return
  function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }

  console.log("this is call ======================")

  let checkvalidate = isValidObjectId(req.params.id)
  if (!checkvalidate) {
    return res.status(400).json({
      success: false, message: 'Invalid product id'
    })
  }
  try {
    const inventory = await ProductStoreInventory.findById(req.params.id)
      .populate('product_id', 'name sku category description brand')
      .populate('store_id', 'store_name location address contact');

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




















//==================================================================================================================

const getProductStore = async (req, res) => {
  try {
    const { productId, storeId } = req.params;

    const inventory = await ProductStoreInventory.findOne({
      product_id: productId,
      store_id: storeId
    })
      .populate('product_id', 'name sku category')
      .populate('store_id', 'name location');

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventory not found for this product-store combination'
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

const getStoreInventory = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { is_available, low_stock } = req.query;

    const filters = { store_id: storeId };
    if (is_available !== undefined) filters.is_available = is_available === 'true';

    let inventory = await ProductStoreInventory.find(filters)
      .populate('product_id', 'name sku category brand')
      .sort({ updated_at: -1 });

    if (low_stock === 'true') {
      inventory = inventory.filter(item => item.quantity <= item.min_quantity);
    }

    res.json({
      success: true,
      data: inventory,
      count: inventory.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to fetch store inventory'
    });
  }
};



const getStoreInventoryByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const inventory = await ProductStoreInventory.find({ product_id: productId })
      .populate('store_id', 'name location address')
      .sort({ quantity: -1 });

    res.json({
      success: true,
      data: inventory,
      count: inventory.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to fetch product inventory'
    });
  }
};



const updateStoreInventory = async (req, res) => {
  try {
    const inventory = await ProductStoreInventory.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated_at: Date.now() },
      { new: true, runValidators: true }
    )
      .populate('product_id', 'name sku')
      .populate('store_id', 'name location');

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventory not found'
      });
    }

    res.json({
      success: true,
      data: inventory,
      message: 'Inventory updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      message: 'Failed to update inventory'
    });
  }
};


const updateQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required'
      });
    }

    const inventory = await ProductStoreInventory.findByIdAndUpdate(
      req.params.id,
      {
        quantity,
        updated_at: Date.now(),
        is_available: quantity > 0
      },
      { new: true, runValidators: true }
    )
      .populate('product_id', 'name sku')
      .populate('store_id', 'name location');

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventory not found'
      });
    }

    res.json({
      success: true,
      data: inventory,
      message: 'Quantity updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      message: 'Failed to update quantity'
    });
  }
};

const restockInventory = async (req, res) => {
  console.log("this  is call no no ");
  try {
    const { additional_quantity } = req.body;

    if (!additional_quantity || additional_quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid additional_quantity is required'
      });
    }

    const inventory = await ProductStoreInventory.findById(req.params.id);

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventory not found'
      });
    }

    inventory.quantity += additional_quantity;
    inventory.last_restocked = Date.now();
    inventory.is_available = inventory.quantity > 0;
    inventory.updated_at = Date.now();

    await inventory.save();

    const populatedInventory = await ProductStoreInventory.findById(inventory._id)
      .populate('product_id', 'name sku')
      .populate('store_id', 'name location');

    res.json({
      success: true,
      data: populatedInventory,
      message: `Restocked ${additional_quantity} units successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to restock inventory'
    });
  }
};


const bulkUpdateInventory = async (req, res) => {
  try {
    const { updates } = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Updates array is required'
      });
    }

    const bulkOps = updates.map(update => ({
      updateOne: {
        filter: {
          product_id: update.product_id,
          store_id: update.store_id
        },
        update: {
          ...update.data,
          updated_at: Date.now()
        },
        upsert: update.upsert || false
      }
    }));

    const result = await ProductStoreInventory.bulkWrite(bulkOps);

    res.json({
      success: true,
      data: result,
      message: `Bulk update completed. Modified: ${result.modifiedCount}, Inserted: ${result.upsertedCount}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Bulk update failed'
    });
  }
};



const deleteInventory = async (req, res) => {
  try {
    const inventory = await ProductStoreInventory.findByIdAndDelete(req.params.id);

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventory not found'
      });
    }

    res.json({
      success: true,
      data: inventory,
      message: 'Inventory deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to delete inventory'
    });
  }
};


const deleteInventoryByProductAndStore = async (req, res) => {
  try {
    const { productId, storeId } = req.params;

    const inventory = await ProductStoreInventory.findOneAndDelete({
      product_id: productId,
      store_id: storeId
    });

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventory not found for this product-store combination'
      });
    }

    res.json({
      success: true,
      data: inventory,
      message: 'Inventory deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to delete inventory'
    });
  }
};




const getLowStockItems = async (req, res) => {
  try {
    const { store_id, threshold } = req.query;

    let query = { is_available: true };
    if (store_id) query.store_id = store_id;

    const inventory = await ProductStoreInventory.find(query)
      .populate('product_id', 'name sku')
      .populate('store_id', 'name location');

    const lowStockItems = inventory.filter(item => {
      const minThreshold = threshold ? parseInt(threshold) : item.min_quantity;
      return item.quantity <= minThreshold;
    });

    res.json({
      success: true,
      data: lowStockItems,
      count: lowStockItems.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to fetch low stock items'
    });
  }
};


const getOutOfStockItems = async (req, res) => {
  try {
    const { store_id } = req.query;

    let query = { quantity: 0 };
    if (store_id) query.store_id = store_id;

    const inventory = await ProductStoreInventory.find(query)
      .populate('product_id', 'name sku')
      .populate('store_id', 'name location');

    res.json({
      success: true,
      data: inventory,
      count: inventory.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to fetch out of stock items'
    });
  }
};

const getInventorySummary = async (req, res) => {
  try {
    const { store_id } = req.query;

    let matchQuery = {};
    if (store_id) matchQuery.store_id = store_id;

    const summary = await ProductStoreInventory.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
          availableProducts: {
            $sum: { $cond: [{ $eq: ['$is_available', true] }, 1, 0] }
          },
          outOfStockProducts: {
            $sum: { $cond: [{ $eq: ['$quantity', 0] }, 1, 0] }
          },
          totalValue: { $sum: { $multiply: ['$quantity', '$price'] } },
          averagePrice: { $avg: '$price' }
        }
      }
    ]);

    res.json({
      success: true,
      data: summary[0] || {
        totalProducts: 0,
        totalQuantity: 0,
        availableProducts: 0,
        outOfStockProducts: 0,
        totalValue: 0,
        averagePrice: 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to generate summary'
    });
  }
};


const getProductwithVarinats = async (req, res) => {
  try {

    let productId = req.params.productId

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "productId is required",
        statusCode: 400
      })
    }

    // const findProductwithvariants= await productStoreInventoryModel.find({product_id:productId})


    //   const findProductwithvariants = await productStoreInventoryModel.aggregate([
    //     {$match:{product_id:new mongoose.Types.ObjectId(productId)}},

    //   {
    //     $lookup:{
    //       from:"stores",
    //       localField:"store_id",
    //       foreignField:"_id",
    //       as:"store"
    //     }
    //   },
    //   { $unwind: "$store" },
    //   { $unwind: "$variants" },

    //   {
    //   $lookup: {
    //     from: "productvariants",
    //     localField: "variants.variant_id",
    //     foreignField: "_id",
    //     as: "variantDetails"
    //   }
    // },

    //   { $unwind: "$variantDetails" }, 
    //   { $unwind: "$variantDetails.attributes" },


    // {
    //       $lookup:{
    //       from:'products',
    //       localField:'product_id',
    //       foreignField:"_id",
    //       as:"product"
    //     }
    //   },
    //   { $unwind: "$product" },

    //    {
    //   $lookup: {
    //     from: "variantattributes",
    //     localField: "variantDetails.attributes.attribute_id",
    //     foreignField: "_id",
    //     as: "attributeDetails"
    //   }
    // },

    //   {
    //   $lookup: {
    //     from: "variantattributevalues",
    //     localField: "variantDetails.attributes.value_id",
    //     foreignField: "_id",
    //     as: "attributeValueDetails"
    //   }
    // },

    // { $unwind: "$attributeDetails" },
    // { $unwind: "$attributeValueDetails" },






    //   ])

    //   const findProductwithvariants = await productStoreInventoryModel.aggregate([
    //   {
    //     $match: { product_id: new mongoose.Types.ObjectId(productId) }
    //   },

    //   // Store info
    //   {
    //     $lookup: {
    //       from: "stores",
    //       localField: "store_id",
    //       foreignField: "_id",
    //       as: "store"
    //     }
    //   },
    //   { $unwind: "$store" },

    //   // Product info
    //   {
    //     $lookup: {
    //       from: "products",
    //       localField: "product_id",
    //       foreignField: "_id",
    //       as: "product"
    //     }
    //   },
    //   { $unwind: "$product" },

    //   // Variants join
    //   {
    //     $lookup: {
    //       from: "productvariants",
    //       localField: "variants.variant_id",
    //       foreignField: "_id",
    //       as: "variantDetails"
    //     }
    //   },
    //   { $unwind: "$variantDetails" },

    //   // Join attribute details
    //   {
    //     $lookup: {
    //       from: "variantattributes",
    //       localField: "variantDetails.attributes.attribute_id",
    //       foreignField: "_id",
    //       as: "attributeDetails"
    //     }
    //   },

    //   // Join attribute values
    //   {
    //     $lookup: {
    //       from: "variantattributevalues",
    //       localField: "variantDetails.attributes.value_id",
    //       foreignField: "_id",
    //       as: "attributeValueDetails"
    //     }
    //   },

    //   // Group by variant (to collect attributes cleanly)
    //   {
    //     $group: {
    //       _id: "$variantDetails._id",
    //       variant_id: { $first: "$variantDetails._id" },
    //       sku: { $first: "$variantDetails.sku" },
    //       variant_name: { $first: "$variantDetails.variant_name" },
    //       base_price: { $first: "$variantDetails.base_price" },
    //       weight: { $first: "$variantDetails.weight" },
    //       images: { $first: "$variantDetails.images" },
    //       is_active: { $first: "$variantDetails.is_active" },
    //       inventory: { $first: "$variants" }, // stock per store
    //       attributes: {
    //         $push: {
    //           attribute: { $arrayElemAt: ["$attributeDetails", 0] },
    //           value: { $arrayElemAt: ["$attributeValueDetails", 0] }
    //         }
    //       },
    //       product: { $first: "$product" },
    //       store: { $first: "$store" }
    //     }
    //   },

    //   // Group by product (to combine all variants under one product)
    //   {
    //     $group: {
    //       _id: "$product._id",
    //       product: { $first: "$product" },
    //       store: { $first: "$store" },
    //       variants: {
    //         $push: {
    //           variant_id: "$variant_id",
    //           sku: "$sku",
    //           variant_name: "$variant_name",
    //           base_price: "$base_price",
    //           weight: "$weight",
    //           images: "$images",
    //           is_active: "$is_active",
    //           inventory: "$inventory",
    //           attributes: "$attributes"
    //         }
    //       }
    //     }
    //   },

    //   // Final clean structure
    //   {
    //     $project: {
    //       _id: 0,
    //       product: 1,
    //       store: 1,
    //       variants: 1
    //     }
    //   }
    // ]);
    // const findProductwithvariants = await productStoreInventoryModel.aggregate([
    //   {
    //     $match: { product_id: new mongoose.Types.ObjectId(productId) }
    //   },

    //   {
    //     $lookup: {
    //       from: "products",
    //       localField: "product_id",
    //       foreignField: "_id",
    //       as: "product"
    //     }
    //   },
    //   { $unwind: "$product" },

    //   {
    //     $lookup: {
    //       from: "productvariants",
    //       localField: "variants.variant_id",
    //       foreignField: "_id",
    //       as: "variantDetails"
    //     }
    //   },
    //   { $unwind: "$variantDetails" },

    //   {
    //     $lookup: {
    //       from: "variantattributes",
    //       localField: "variantDetails.attributes.attribute_id",
    //       foreignField: "_id",
    //       as: "attributeDetails"
    //     }
    //   },

    //   {
    //     $lookup: {
    //       from: "variantattributevalues",
    //       localField: "variantDetails.attributes.value_id",
    //       foreignField: "_id",
    //       as: "attributeValueDetails"
    //     }
    //   },

    //   {
    //     $group: {
    //       _id: "$variantDetails._id",
    //       variant_id: { $first: "$variantDetails._id" },
    //       sku: { $first: "$variantDetails.sku" },
    //       variant_name: { $first: "$variantDetails.variant_name" },
    //       base_price: { $first: "$variantDetails.base_price" },
    //       weight: { $first: "$variantDetails.weight" },
    //       images: { $first: "$variantDetails.images" },
    //       is_active: { $first: "$variantDetails.is_active" },
    //       inventory: { $first: "$variants" }, 
    //       attributes: {
    //         $push: {
    //           attribute: { $arrayElemAt: ["$attributeDetails", 0] },
    //           value: { $arrayElemAt: ["$attributeValueDetails", 0] }
    //         }
    //       },
    //       product: { $first: "$product" }
    //     }
    //   },

    //   {
    //     $group: {
    //       _id: "$product._id",
    //       product: { $first: "$product" },
    //       variants: {
    //         $push: {
    //           variant_id: "$variant_id",
    //           sku: "$sku",
    //           variant_name: "$variant_name",
    //           base_price: "$base_price",
    //           weight: "$weight",
    //           images: "$images",
    //           is_active: "$is_active",
    //           inventory: "$inventory",
    //           attributes: "$attributes"
    //         }
    //       }
    //     }
    //   },

    //  {
    //   $project: {
    //     _id: 0,
    //     product: {
    //       _id: "$product._id",
    //       name: "$product.name",
    //       description: "$product.description",
    //       imageUrl: "$product.imageUrl",
    //       price: {
    //         $cond: {
    //           if: { $eq: [{ $size: "$variants" }, 0] },
    //           then: "$product.price",
    //           else: null
    //         }
    //       },
    //       stock: {
    //         $cond: {
    //           if: { $eq: [{ $size: "$variants" }, 0] },
    //           then: "$product.stock",
    //           else: null
    //         }
    //       }
    //     },
    //     variants: {
    //       $cond: {
    //         if: { $gt: [{ $size: "$variants" }, 0] },
    //         then: "$variants",
    //         else: []
    //       }
    //     }
    //   }
    // }

    // ]);
    const findProductwithvariants = await productStoreInventoryModel.aggregate([
      // Match the product inventory document
      {
        $match: { product_id: new mongoose.Types.ObjectId(productId) }
      },

      // Get product details
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },

      // Unwind variants array to work with individual variants
      { $unwind: "$variants" },

      // Lookup variant details
      {
        $lookup: {
          from: "productvariants",
          localField: "variants.variant_id",
          foreignField: "_id",
          as: "variantDetails"
        }
      },
      { $unwind: "$variantDetails" },

      // Unwind attributes array from variant to lookup each attribute
      {
        $unwind: {
          path: "$variantDetails.attributes",
          preserveNullAndEmptyArrays: true
        }
      },

      // Lookup attribute details
      {
        $lookup: {
          from: "variantattributes",
          localField: "variantDetails.attributes.attribute_id",
          foreignField: "_id",
          as: "attributeDetails"
        }
      },

      // Lookup attribute value details
      {
        $lookup: {
          from: "variantattributevalues",
          localField: "variantDetails.attributes.value_id",
          foreignField: "_id",
          as: "attributeValueDetails"
        }
      },

      // Group back by variant to collect all attributes
      {
        $group: {
          _id: "$variantDetails._id",
          variant_id: { $first: "$variantDetails._id" },
          sku: { $first: "$variantDetails.sku" },
          variant_name: { $first: "$variantDetails.variant_name" },
          base_price: { $first: "$variantDetails.base_price" },
          weight: { $first: "$variantDetails.weight" },
          images: { $first: "$variantDetails.images" },
          is_active: { $first: "$variantDetails.is_active" },

          // Get inventory specific to this variant
          inventory: {
            $first: {
              quantity: "$variants.quantity",
              reserved_quantity: "$variants.reserved_quantity",
              price: "$variants.price",
              discounted_price: "$variants.discounted_price",
              min_quantity: "$variants.min_quantity",
              max_quantity: "$variants.max_quantity",
              low_stock_threshold: "$variants.low_stock_threshold",
              is_available: "$variants.is_available",
              last_restocked: "$variants.last_restocked"
            }
          },

          // Collect all attributes for this variant
          attributes: {
            $push: {
              $cond: {
                if: { $ne: ["$attributeDetails", []] },
                then: {
                  attribute: { $arrayElemAt: ["$attributeDetails", 0] },
                  value: { $arrayElemAt: ["$attributeValueDetails", 0] }
                },
                else: "$$REMOVE"
              }
            }
          },
          product: { $first: "$product" }
        }
      },

      // Group by product to collect all variants
      {
        $group: {
          _id: "$product._id",
          product: { $first: "$product" },
          variants: {
            $push: {
              variant_id: "$variant_id",
              sku: "$sku",
              variant_name: "$variant_name",
              base_price: "$base_price",
              weight: "$weight",
              images: "$images",
              is_active: "$is_active",
              inventory: "$inventory",
              attributes: {
                $filter: {
                  input: "$attributes",
                  as: "attr",
                  cond: { $ne: ["$$attr", null] }
                }
              }
            }
          }
        }
      },

      {
        $project: {
          _id: 0,
          product: {
            _id: "$product._id",
            name: "$product.name",
            description: "$product.description",
            imageUrl: "$product.imageUrl",
            price: {
              $cond: {
                if: { $eq: [{ $size: "$variants" }, 0] },
                then: "$product.price",
                else: null
              }
            },
            stock: {
              $cond: {
                if: { $eq: [{ $size: "$variants" }, 0] },
                then: "$product.stock",
                else: null
              }
            }
          },
          variants: {
            $cond: {
              if: { $gt: [{ $size: "$variants" }, 0] },
              then: "$variants",
              else: []
            }
          }
        }
      }
    ]);

    console.log(findProductwithvariants, '===================================sample')

    res.json({
      findProductwithvariants: findProductwithvariants
    })

    return


    if (!findProductwithvariants) {
      return res.status(404).json({
        success: false,
        message: "product inventory is not found"
      })
    }



  } catch (error) {
    return res.status(500).json({
      message: `server error${error}`
    })
  }
}


const allEcommerceProducts = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    const totalCount = await Product.countDocuments({ status: "completed" });

    const allProducts = await Product.aggregate([
   
      {
        $lookup: {
          from: "productstoreinventories",
          localField: "_id",
          foreignField: "product_id",
          as: "inventories"
        }
      },
      {
        $addFields: {
          totalQuantity: {
            $sum: {
              $map: {
                input: "$inventories",
                as: "inv",
                in: {
                  $cond: [
                    { $gt: [{ $size: { $ifNull: ["$$inv.variants", []] } }, 0] },
                    {
                      $sum: {
                        $map: {
                          input: "$$inv.variants",
                          as: "v",
                          in: "$$v.quantity"
                        }
                      }
                    },
                    "$$inv.base_inventory.quantity"
                  ]
                }
              }
            }
          }
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "categories"
        }
      },
      {
        $addFields: {
          category_name: { $arrayElemAt: ["$categories.name", 0] }
        }
      },
      {
        $project: {
          inventories: 0,
          categories: 0
        }
      },
      { $skip: skip },
      { $limit: limit }
    ]);

    if (!allProducts || allProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found"
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Products fetched successfully",
      products: allProducts,
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit)
    });

  } catch (error) {
    console.error("Get all products error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};


//==================================================================================================================
module.exports = {
  addproductInventory,
  // updateProductInventory,
  getAllProducts,
  fetchInventory,
  getproductStoreInventory,
  getProductStore,
  getStoreInventory,
  getStoreInventoryByProduct,
  updateStoreInventory,
  updateQuantity,
  restockInventory,
  bulkUpdateInventory,
  deleteInventory,
  deleteInventoryByProductAndStore,
  getLowStockItems,
  getOutOfStockItems,
  getInventorySummary,
  addProductVariant,
  getProductwithVarinats,
  getProductforInventory,
  allEcommerceProducts

};
