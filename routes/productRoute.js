const express = require('express');
const {addproductInventory} = require('../controller/products/productController');
const router = express.Router();
const { verifyToken, adminOnly } = require('../middleware/auth');


router.post('/add-inventory-product',verifyToken,adminOnly,addproductInventory)

module.exports = router


