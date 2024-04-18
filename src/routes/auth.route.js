const express = require('express');
const AuthController = require('../controllers/auth/auth.controller');
const { validateUserLogin, validateCreateUserAccount, validateEmailSend, validateCreatePassword } = require('../validations/auth.validation');
const verifyToken = require('../middleware/verify-jwt');
const RegisterController = require('../controllers/auth/register.controller');
const router = express.Router();

const authController = new AuthController();
const registerController = new RegisterController();

/**
 * @swagger
 * /auth/login:
 * post: 
 *  summary: Get a resource
 *  description: Get a specific resource by ID.
 *  parameters:
 *      — in: path
 *  name: id
 *  required: true
 *  description: ID of the resource to retrieve.
 *  schema:
 *      type: string
 *  responses:
 *      200:
 *      description: Successful response
 */

router.post('/login', validateUserLogin, authController.login);
router.post('/logout', authController.logout);
router.post('/create-password', validateCreatePassword, authController.createPassword);
router.post('/register', validateCreateUserAccount, registerController.register);

module.exports = router;