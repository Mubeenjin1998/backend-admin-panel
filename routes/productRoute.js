const express = require('express');
const productController = require('../controller/products/productController');
const router = express.Router();
const { verifyToken, adminOnly } = require('../middleware/auth');

// Product management routes
router.get('/get-all-products', productController.getAllProducts);

// Inventory management routes
router.post('/add-inventory-product', verifyToken, adminOnly, productController.addproductInventory);
router.get('/get-all-product-inventory', productController.fetchInventory);
router.get('/get-product-inventory/:id', productController.getproductStoreInventory);
router.get('/product/:productId/store/:storeId', productController.getProductStore);
router.get('/store/all-products/:storeId', productController.getStoreInventory);
router.get('/product/:productId', productController.getStoreInventoryByProduct);
router.put('/update-inventoryProduct-restock/:id',productController.restockInventory);
router.put('/update-store-inventory/:id', productController.updateStoreInventory);
router.get('/multiple-update-invetory', productController.bulkUpdateInventory);
router.delete('/delete-inventory/:id', productController.deleteInventory);
router.delete('/product/:productId/store/:storeId', productController.deleteInventoryByProductAndStore);
router.get('/reports/low-stock', productController.getLowStockItems);
router.get('/reports/out-of-stock', productController.getOutOfStockItems);
router.get('/reports/summary', productController.getInventorySummary);



module.exports = router;


