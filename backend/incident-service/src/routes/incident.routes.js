const express = require('express');
const router = express.Router();
const { reportIncident, getAll,getIncidentsInBbox,confirmIncident } = require('../controllers/incident.controller');
const verifyToken = require('../middlewares/verifyToken');

router.post('/', reportIncident);
router.get('/', getAll);
router.get('/', getIncidentsInBbox); 
router.post('/:id/confirm',verifyToken, confirmIncident);




module.exports = router;
