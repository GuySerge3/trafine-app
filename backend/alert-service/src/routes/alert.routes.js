const express = require('express');
const router = express.Router();
const { getRecentAlerts } = require('../controllers/alert.controller');

router.get('/recent', getRecentAlerts);

module.exports = router;
