const express = require('express');
const RefreshTokenController = require('../controllers/refresh-token.controller');
const router = express.Router();

const refreshTokenController = new RefreshTokenController();
router.get('/token/refresh', refreshTokenController.handle);

module.exports = router;