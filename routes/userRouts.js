const express = require("express");
const router = express.Router();
const UsersController = require("../controller/userController");
router.post('/',UsersController.createUsers);
router.post('/register',UsersController.createUsers);
router.put('/:id',UsersController.updateUser);
router.delete('/:id',UsersController.deleteUser);
router.get('/',UsersController.getUser);
router.get('/:id',UsersController.getUserById);
router.get('/countUser',UsersController.countUser);


module.exports = router;