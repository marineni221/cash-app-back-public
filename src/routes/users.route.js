const express = require('express');
const UserController = require('../controllers/user.controller');
const { validateCreateUser } = require('../validations/users.validation');
const router = express.Router();

const userController = new UserController();

/* GET users */
router.get('/', userController.findAll);
router.post('/', validateCreateUser, userController.store);
router.get('/:id', userController.findOne);

module.exports = router;
