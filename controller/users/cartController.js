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
const ShoppingCart = require('../../models/shoppingCart');
const CartHistory = require('../../models/cartHistory');
const User = require('../../models/User');
const ObjectId = mongoose.Types.ObjectId;



const addtoCart = async (req, res) => {
  try {
    const { productId, quantity = 1, variantId } = req.body;
    const userId = req.user.id;

    // --- Fetch product with inventory ---
    const [product] = await Product.aggregate([
      {
        $match: { _id: new ObjectId(productId) }
      },
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
                          in: { $ifNull: ["$$v.quantity", 0] }
                        }
                      }
                    },
                    { $ifNull: ["$$inv.base_inventory.quantity", 0] }
                  ]
                }
              }
            }
          }
        }
      },
      {
        $project: { __v: 0 }
      }
    ]);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // --- Determine available stock ---
    let availableStock = product.totalQuantity;
    let selectedVariant = null;

    if (variantId) {
      const variantInInventory = product.inventories
        .flatMap(inv => inv.variants || [])
        .find(v => v._id.toString() === variantId.toString());

      if (!variantInInventory) {
        return res.status(400).json({
          success: false,
          message: "Selected variant not found"
        });
      }

      if (!variantInInventory.isActive) {
        return res.status(400).json({
          success: false,
          message: "Selected variant is not active"
        });
      }

      selectedVariant = variantInInventory;
      availableStock = variantInInventory.quantity;
    }

    // --- Effective price ---
    let effectivePrice = product.price;
    if (selectedVariant && selectedVariant.priceAdjustment) {
      effectivePrice += selectedVariant.priceAdjustment;
    }

    if (effectivePrice == null || effectivePrice < 0) {
      return res.status(400).json({
        success: false,
        message: "Product price is not available"
      });
    }

    // --- Find or create cart ---
    let cart = await ShoppingCart.findOne({
      userId: userId,
      status: "active"
    });

    if (!cart) {
      cart = new ShoppingCart({
        userId: userId,
        items: []
      });
    }

    // --- Check if item already in cart ---
    const existingItemIndex = cart.items.findIndex(
      item =>
        item.productId.toString() === productId &&
        (item.variantId?.toString() === variantId?.toString() ||
          (!item.variantId && !variantId))
    );

    let quantityBefore = 0;
    let actionType = "ADD";

    if (existingItemIndex > -1) {
      // Updating existing item
      const existingItem = cart.items[existingItemIndex];
      quantityBefore = existingItem.quantity;

      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > availableStock) {
        return res.status(400).json({
          success: false,
          message: `Only ${availableStock} units available in stock`
        });
      }

      existingItem.quantity = newQuantity;
      existingItem.addedAt = new Date();
      existingItem.priceAtTime = effectivePrice;
      existingItem.productSnapshot = {
        productName: product.name,
        imageUrl: product.imageUrl?.[0] || null
      };

      actionType = "UPDATE";
    } else {
      // Adding new item
      if (quantity > availableStock) {
        return res.status(400).json({
          success: false,
          message: `Only ${availableStock} units available in stock`
        });
      }

      cart.items.push({
        productId,
        productSnapshot: {
          productName: product.name,
          imageUrl: product.imageUrl?.[0] || null
        },
        variantId: variantId || null,
        quantity,
        priceAtTime: effectivePrice
      });
    }

    await cart.save();

    // --- Save to cart history ---
    await CartHistory.create({
      cartId: cart._id,
      userId: userId,
      actionType,
      productId,
      quantityBefore,
      quantityAfter:
        existingItemIndex > -1
          ? cart.items[existingItemIndex].quantity
          : quantity,
      priceAtTime: effectivePrice,
      metadata: {
        userAgent: req.get("User-Agent"),
        ipAddress: req.ip,
        variantId: variantId || null
      }
    });

    // --- Populate product info ---
    await cart.populate({
      path: "items.productId",
      select: "name price imageUrl isActive"
    });

    cart.items = cart.items.filter(item => item.productId);

    // --- Response ---
    const responseData = {
      success: true,
      message:
        actionType === "UPDATE"
          ? "Cart item quantity updated successfully"
          : "Item added to cart successfully",
      data: {
        cart: {
          id: cart._id,
          totalItems: cart.totalItems,
          totalQuantity: cart.totalQuantity,
          totalAmount: cart.totalAmount,
          netTotal: cart.getNetTotal(),
          currency: cart.currency,
          updatedAt: cart.updatedAt
        },
        addedItem: {
          productId: product._id,
          productName: product.name,
          quantity:
            actionType === "UPDATE"
              ? cart.items[existingItemIndex].quantity
              : quantity,
          priceAtTime: effectivePrice,
          variant: selectedVariant
            ? {
                id: selectedVariant._id,
                name: selectedVariant.variantName,
                value: selectedVariant.variantValue,
                priceAdjustment: selectedVariant.priceAdjustment
              }
            : null
        }
      }
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Add to cart error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided",
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format provided"
      });
    }

    res.status(500).json({
      success: false,
      message: "An error occurred while adding item to cart",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};



const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log(userId,'=================userId===================')




    let cart = await ShoppingCart.findOne({
      userId,
      status: "active"
    }).populate({
      path: "items.productId",
      select: "name price imageUrl isActive"
    });

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        data: {
          cart: {
            id: null,
            totalItems: 0,
            totalQuantity: 0,
            totalAmount: 0,
            netTotal: 0,
            currency: "INR",
            updatedAt: null,
            items: []
          }
        }
      });
    }

    cart.items = cart.items.filter(item => item.productId);

    const responseData = {
      success: true,
      message: "Cart fetched successfully",
      data: {
        cart: {
          id: cart._id,
          totalItems: cart.totalItems,
          totalQuantity: cart.totalQuantity,
          totalAmount: cart.totalAmount,
          netTotal: cart.getNetTotal(),
          currency: cart.currency,
          updatedAt: cart.updatedAt,
          items: cart.items.map(item => ({
            productId: item.productId._id,
            productName: item.productId.name,
            imageUrl: item.productId.imageUrl?.[0] || null,
            isActive: item.productId.isActive,
            variantId: item.variantId,
            quantity: item.quantity,
            priceAtTime: item.priceAtTime,
            productSnapshot: item.productSnapshot
          }))
        }
      }
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching cart",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

const removeFromCart = async (req, res) => {

  try{

    const userId = req.user.id;
    const { productId, variantId } = req.body;
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }
    let cart = await ShoppingCart.findOne({
      userId,
      status: "active"
    });
    if (!cart) {

      return res.status(404).json({
        success: false,
        message: "No active cart found"
      });
    }
    const itemIndex = cart.items.findIndex(
      item =>
        item.productId.toString() === productId &&
        (item.variantId?.toString() === variantId?.toString() ||
          (!item.variantId && !variantId))
    );
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart"
      });
    }
    const itemToRemove = cart.items[itemIndex];
    const quantityBefore = itemToRemove.quantity;
    cart.items.splice(itemIndex, 1);
    await cart.save();
    await CartHistory.create({
      cartId: cart._id,
      userId: userId,
      actionType: "REMOVE",
      productId,
      quantityBefore,
      quantityAfter: 0,
      priceAtTime: itemToRemove.priceAtTime,
      metadata: {
        userAgent: req.get("User-Agent"),
        ipAddress: req.ip,
        variantId: variantId || null
      }
    }); 

    res.status(200).json({
      success: true,
      message: "Item removed from cart successfully"
    });


  }catch(error){
    console.error("Remove from cart error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while removing item from cart",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
}



module.exports = { addtoCart,getCart,removeFromCart };