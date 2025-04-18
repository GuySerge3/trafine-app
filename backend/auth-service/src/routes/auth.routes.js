const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/role.middleware');

router.post('/register', register);
router.post('/login', login);


router.get('/admin-test', authMiddleware, checkRole('admin'), (req, res) => {
  res.send('Bienvenue Admin !');
});

module.exports = router;
