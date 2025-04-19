const express = require('express');
const router = express.Router();
const { getRoute } = require('../controllers/route.controller');

router.post('/', getRoute);

module.exports = router;
