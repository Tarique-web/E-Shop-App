const express = require("express");
const router = express.Router();
const UsersController = require("../controller/userController");
router.post('/',UsersController.users)



module.exports = router;