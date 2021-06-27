const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");
router.post('/',orderController.createOrder);
router.put("/:id",orderController.updateOrder);
router.delete("/:id",orderController.removeOrder);
router.get('/',orderController.getOrder);
router.get('/:id',orderController.getByIdOrder);
router.get('/users/:userId',orderController.getUserOrder);
router.get('/orderCount',orderController.ordersCount);
router.get('/totalSales',orderController.getTotalSales);

module.exports = router;