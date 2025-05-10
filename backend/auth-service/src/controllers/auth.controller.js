const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.register = async (req, res) => {
    const { email, password, role } = req.body;
    try {
      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({
        email,
        password: hashed,
        role: role || 'user' 
      });
      res.status(201).json({ message: 'Utilisateur créé', userId: user._id, role: user.role });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Mot de passe invalide' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('email createdAt');

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json({
      email: user.email,
      createdAt: user.createdAt
    });
  } catch (err) {
    console.error("❌ Erreur getUserInfo:", err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

