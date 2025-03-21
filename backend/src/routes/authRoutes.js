const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();


router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword, role: "user" });
      await newUser.save();
      res.status(201).json({ message: "Utilisateur créé avec succès", user: newUser });
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de l'inscription" });
    }
  });
  
  
  

  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "Utilisateur non trouvé" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Mot de passe incorrect" });
  
      // ✅ Ajouter `role: user.role` dans le token
      const token = jwt.sign(
        { id: user._id, role: user.role }, // 🔥 Correction ici !
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      res.json({
        token,
        user: { id: user._id, username: user.username, email: user.email, role: user.role }
      });
  
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la connexion" });
    }
  });

module.exports = router;
