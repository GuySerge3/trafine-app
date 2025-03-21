const express = require("express");
const Route = require("../models/Route");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// 🚗 Enregistrer un itinéraire (PROTÉGÉ)
router.post("/", authMiddleware, async (req, res) => {
  const { name, start, end } = req.body;

  if (!name || !start || !end) {
    return res.status(400).json({ message: "Tous les champs sont requis" });
  }

  try {
    const newRoute = new Route({
      user: req.user.id,
      name,
      start,
      end
    });

    await newRoute.save();
    res.status(201).json({ message: "Itinéraire enregistré", route: newRoute });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'enregistrement" });
  }
});

// 🚗 Voir mes itinéraires (PROTÉGÉ)
router.get("/", authMiddleware, async (req, res) => {
    try {
      const routes = await Route.find({ user: req.user.id });
      res.json(routes);
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la récupération" });
    }
  });
  

module.exports = router;
