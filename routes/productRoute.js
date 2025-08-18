const express = require('express');
const productController = require('../controller/products/productController');
const router = express.Router();
const { verifyToken, adminOnly } = require('../middleware/auth');

// Product management routes
router.get('/get-all-products', productController.getAllProducts);

// Inventory management routes
router.post('/add-inventory-product', verifyToken, adminOnly, productController.addproductInventory);
router.get('/get-all-product-inventory', productController.fetchInventory);
router.get('/get-product-inventory/:id', productController.getproduductStoreInventory);
router.get('/product/:productId/store/:storeId', productController.getProductStore);
router.get('/store/:storeId', productController.getProductStore);
router.get('/store/all-products/:storeId', productController.getStoreInventory);

module.exports = router;


