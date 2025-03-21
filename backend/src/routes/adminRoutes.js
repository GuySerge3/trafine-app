const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRole");

const router = express.Router();

// 📋 Voir tous les utilisateurs (ADMIN SEULEMENT)
router.get("/users", authMiddleware, checkRole(["admin"]), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs" });
  }
});

// 🛠 Modifier le rôle d'un utilisateur (ADMIN SEULEMENT)
router.patch("/users/:id/role", authMiddleware, checkRole(["admin"]), async (req, res) => {
    const { role } = req.body;
  
    if (!["user", "moderator", "admin"].includes(role)) {
      return res.status(400).json({ message: "Rôle invalide" });
    }
  
    try {
      const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
      if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
  
      res.json({ message: "Rôle mis à jour", user });
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la mise à jour du rôle" });
    }
  });
  

module.exports = router;
