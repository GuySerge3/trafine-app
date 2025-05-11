const axios = require("axios");
const Incident = require('../models/incident.model');

exports.reportIncident = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    const { type, description, location } = req.body;

    // 📍 Appel à Nominatim pour récupérer l’adresse
    let address = "";
    try {
      const { data } = await axios.get("https://nominatim.openstreetmap.org/reverse", {
        params: {
          lat: location.coordinates[1],
          lon: location.coordinates[0],
          format: "json"
        },
        headers: {
          "User-Agent": "trafine-app"
        }
      });
      address = data.display_name || "";
    } catch (geoError) {
      console.warn("❗ Reverse geocoding failed :", geoError.message);
    }

    const incident = await Incident.create({
      type,
      description,
      location,
      user: req.user.id,
      address // ✅ Enregistrement de l'adresse
    });

    res.status(201).json(incident);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const incidents = await Incident.find().sort({ createdAt: -1 });
    res.json(incidents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getIncidentsInBbox = async (req, res) => {
  try {
    const [minLng, minLat, maxLng, maxLat] = req.query.bbox.split(',').map(Number);

    const incidents = await Incident.find({
      location: {
        $geoWithin: {
          $box: [
            [minLng, minLat],
            [maxLng, maxLat]
          ]
        }
      }
    });

    res.json(incidents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteIncident = async (req, res) => {
  const { id } = req.params;

  try {
    const incident = await Incident.findById(id);
    if (!incident) {
      return res.status(404).json({ message: 'Incident introuvable' });
    }

    await Incident.findByIdAndDelete(id);
    res.json({ message: 'Incident supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.confirmIncident = async (req, res) => {
  const { id } = req.params;
  const { userId, confirmed } = req.body;

  try {
    const incident = await Incident.findById(id);
    if (!incident) return res.status(404).json({ message: 'Incident not found' });

    const alreadyConfirmed = incident.confirmations.find(c => c.userId === userId);
    if (alreadyConfirmed) {
      return res.status(400).json({ message: 'Vous avez déjà voté pour cet incident.' });
    }

    incident.confirmations.push({ userId, confirmed });
    await incident.save();

    const totalYes = incident.confirmations.filter(c => c.confirmed).length;
    const totalNo = incident.confirmations.filter(c => !c.confirmed).length;

    if (totalNo >= 3 && totalYes === 0) {
      await Incident.findByIdAndDelete(id);
      return res.json({ message: "Incident supprimé automatiquement (trop de refus)" });
    }

    res.json({
      message: "Confirmation enregistrée",
      confirmations: {
        oui: totalYes,
        non: totalNo
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
