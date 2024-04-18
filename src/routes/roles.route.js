const express = require('express');
const RoleController = require('../controllers/role.controller');
const { validateCreateRole, validateUpdateRole } = require('../validations/roles.validation');
const verifyToken = require('../middleware/verify-jwt');
const router = express.Router();

const roleController = new RoleController();

router.get('/', verifyToken, roleController.findAll);
router.post('/', verifyToken, validateCreateRole, roleController.store, );
router.get('/:id', roleController.findOne);
router.put('/:id', validateUpdateRole, roleController.update);
router.delete('/:id', roleController.delete);

module.exports = router;