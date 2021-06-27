const express = require("express");
const router = express.Router();
const categoryController = require("../controller/categoryController");
router.post('/',categoryController.createCategory);
router.put('/update/:id',categoryController.updateCategory);
router.delete('/delete/:id',categoryController.deleteCategory);
router.get('/',categoryController.getCategory);
router.get('/:id',categoryController.getCategoryById);


module.exports = router;