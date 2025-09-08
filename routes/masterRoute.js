const {
    addCategory,
    getCategories,
    updateCategory,
    deleteCategory,
    getCategoryById,
    addSubcategory,
    updateSubcategory,
    getSubcategoriesAll,
    getSubcategoryById,
    deleteSubcategory,
    addBrand,
    updateBrand,
    getBrands,
    getBrandById,
    deleteBrand,
    addStore,
    updateStore,
    getStores,
    getStoreById,
    deleteStore,
    addStoreImages,
    removeStoreImages,
    getSubcategoriesbyCategoryId,
    addVariantAttribute,
    updateVariantAttribute,
    getVariantAttributes,
    getVariantAttributeById,
    deleteVariantAttribute,
    getVariantAttributeByCategoryId
}= require('../controller/master/masterController');
const express = require('express');
const router = express.Router();
const { verifyToken, adminOnly } = require('../middleware/auth');
const parseJSONFields = require('../middleware/parseJSONFields')

const upload = require('../middleware/upload');

// router.post('/categories', verifyToken, adminOnly,upload.single('image'), addCategory);
router.get('/categories',getCategories);
// router.put('/categories', verifyToken, adminOnly,upload.single('image'), updateCategory); 
router.get('/categories/:id',getCategoryById);
router.delete('/categories/:id',deleteCategory);

// router.post('/subcategories', verifyToken, adminOnly,upload.single('image'), addSubcategory);
router.get('/subcategories',getSubcategoriesAll);
// router.put('/subcategories', verifyToken, adminOnly,upload.single('image'),updateSubcategory); 
router.get('/subcategories/:id',getSubcategoryById);
router.delete('/subcategories/:id',deleteSubcategory);
router.get('/get-subcategories', getSubcategoriesbyCategoryId);

// router.post('/brands', verifyToken, adminOnly,upload.single('image'), addBrand);
router.get('/brands',getBrands);
// router.put('/brands', verifyToken, adminOnly,upload.single('image'), updateBrand); 
router.get('/brands/:id',getBrandById);
router.delete('/brands/:id',deleteBrand);

router.post('/store',upload("product").array('images', 5),parseJSONFields,verifyToken, addStore);
router.get('/store', getStores);
router.put('/store', updateStore); 
router.get('/store/:id', getStoreById);
router.delete('/store/:id', deleteStore);
// router.put('/store/image-upload',upload.array('image',5),addStoreImages)
// router.put('/store/image-upload',upload.single('image'),removeStoreImages)


router.post('/variants', addVariantAttribute);
router.get('/variants', getVariantAttributes);
router.put('/variants', updateVariantAttribute); 
router.get('/variants/:id', getVariantAttributeById);
router.get('/variants-by-categoryId', getVariantAttributeByCategoryId);
router.delete('/variants/:id', deleteVariantAttribute);












//====================================================================================variants==================================



module.exports = router;







