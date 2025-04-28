const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser } = require('../controllers/user.controller');
const verifyToken = require('../middlewares/verifyToken');
const checkRole = require('../middlewares/checkRole');

router.get('/', getAllUsers);
router.delete('/:id', deleteUser);
router.delete('/:id', verifyToken, checkRole('admin'), deleteUser);
router.patch('/:id/role', verifyToken, checkRole('admin'), updateUserRole);


module.exports = router;
