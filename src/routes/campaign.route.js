const express = require('express');
const { validateCreateCampaign } = require('../validations/campaign.validation');
const PaymentCampaignController = require('../controllers/payment-campaign.controller');
const router = express.Router();

const campaignController = new PaymentCampaignController();

router.post('/create', validateCreateCampaign, campaignController.create);
router.get('/', campaignController.all);
router.get('/search/:name', campaignController.searchByName);
router.get('/search/:name/like', campaignController.searchNameLike);

module.exports = router;