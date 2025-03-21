const express = require("express");
const Incident = require("../models/Incident");
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRole");
const sendEmail = require("../config/email");


const router = express.Router();


router.post("/", authMiddleware, async (req, res) => {
  const { type, description, location } = req.body;

  if (!type || !description || !location || !location.latitude || !location.longitude) {
    return res.status(400).json({ message: "Tous les champs sont requis" });
  }

  try {
    const newIncident = new Incident({
      user: req.user.id,
      type,
      description,
      location
    });

    await newIncident.save();
    res.status(201).json({ message: "Incident signalé avec succès", incident: newIncident });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors du signalement de l'incident" });
  }
});


router.get("/", async (req, res) => {
    try {
      const incidents = await Incident.find().populate("user", "username email");
      res.json(incidents);
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la récupération des incidents" });
    }
  });


  // ✅/❌ Valider ou rejeter un incident (MODÉRATEUR & ADMIN SEULEMENT)
router.patch("/:id/status", authMiddleware, checkRole(["moderator", "admin"]), async (req, res) => {
    const { status } = req.body;
  
    if (!["validated", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Statut invalide. Choisissez 'validated' ou 'rejected'." });
    }
  
    try {
      const incident = await Incident.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate("user", "email username");
  
      if (!incident) {
        return res.status(404).json({ message: "Incident non trouvé" });
      }
  
      // 🔔 Envoyer un email à l’utilisateur
      const emailSubject = status === "validated" ? "Votre incident a été validé ✅" : "Votre incident a été rejeté ❌";
      const emailText = `Bonjour ${incident.user.username},\n\nVotre signalement "${incident.description}" a été ${status}.\n\nMerci d'utiliser notre application.\nL'équipe Trafine.`;
  
      await sendEmail(incident.user.email, emailSubject, emailText);
  
      res.json({ message: `Incident ${incident._id} ${status}`, incident });
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la mise à jour du statut", error: err.message });
    }
  });
  
  // 📊 Voir tous les incidents avec leur statut (MODÉRATEUR & ADMIN SEULEMENT)
router.get("/dashboard", authMiddleware, checkRole(["moderator", "admin"]), async (req, res) => {
    try {
      const incidents = await Incident.find().populate("user", "username email");
      res.json(incidents);
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la récupération des incidents", error: err.message });
    }
  });

  // 🔍 Voir uniquement les incidents en attente (MODÉRATEUR & ADMIN SEULEMENT)
router.get("/pending", authMiddleware, checkRole(["moderator", "admin"]), async (req, res) => {
    try {
      const incidents = await Incident.find({ status: "pending" }).populate("user", "username email");
      res.json(incidents);
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la récupération des incidents en attente", error: err.message });
    }
  });
  

module.exports = router;
