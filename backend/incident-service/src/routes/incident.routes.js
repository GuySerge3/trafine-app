const express = require('express');
const router = express.Router();
const { reportIncident, getAll,getIncidentsInBbox,confirmIncident,deleteIncident } = require('../controllers/incident.controller');
const verifyToken = require('../middlewares/verifyToken');
const checkRole = require('../middlewares/checkRole');


router.post('/', verifyToken, checkRole('user', 'moderator', 'admin'), reportIncident);
router.get('/', getAll);
router.get('/bbox', getIncidentsInBbox); 
router.post('/:id/confirm',verifyToken, confirmIncident);
router.delete('/:id', verifyToken, checkRole('moderator', 'admin'), deleteIncident);




module.exports = router;
