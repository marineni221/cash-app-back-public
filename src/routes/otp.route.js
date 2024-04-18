const express = require('express');
const { validateEmailSend } = require('../validations/auth.validation');
const { validatePhoneCodeResend } = require('../validations/verification.validation');
const OtpController = require('../controllers/otp.controller');
const router = express.Router();

const otpController = new OtpController();

router.post('/phone/resend-otp', validatePhoneCodeResend, otpController.resendOtpPhone);
router.post('/email/send', validateEmailSend, otpController.sendLinkToEmail);

module.exports = router;