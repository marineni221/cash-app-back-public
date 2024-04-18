const express = require('express');
const { validatePhoneCodeChecking, validateEmailToken } = require('../validations/verification.validation');
const VerificationController = require('../controllers/auth/verification.controller');
const router = express.Router();

const verificationController = new VerificationController();

router.post('/email/check-token', validateEmailToken, verificationController.checkEmailToken);
router.post('/phone/checkOtp', validatePhoneCodeChecking, verificationController.checkPhoneOtp);

module.exports = router;