const express = require('express');
const productController = require('../controller/products/productController');
const router = express.Router();
const { verifyToken, adminOnly } = require('../middleware/auth');


const {addtoCart,getCart,removeFromCart} = require('../controller/users/cartController');

router.post('/cart/add-item', verifyToken, addtoCart);
router.get('/cart', verifyToken, getCart);
router.put('/cart/remove-item', verifyToken, removeFromCart);


// router.get('/cart', verifyToken, cartController.getCart);
// router.put('/cart/update-item', verifyToken, cartController.updateCartItem);
// router.delete('/cart/remove-item/:itemId', verifyToken, cartController.removeCartItem);
// router.delete('/cart/clear', verifyToken, cartController.clearCart);

module.exports = router;

