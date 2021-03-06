const express = require("express");
const router = express.Router();
const productController = require("../controller/productsController");
router.post('/',productController.createProduct);
router.put('/update/:id',productController.updateProduct);
router.delete('/delete/:id',productController.deleteProduct);
router.get('/get/countProduct',productController.countProduct);
router.get('/featuredProdcut',productController.featuredProduct);
router.get('/filterProduct',productController.filterProduct);
router.get('/',productController.getAllProduct);


module.exports = router;