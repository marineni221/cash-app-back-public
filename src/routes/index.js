const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({ status: 'ok', statusCode: 200 });
});

module.exports = router;
