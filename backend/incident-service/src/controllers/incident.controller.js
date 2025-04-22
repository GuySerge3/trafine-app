const Incident = require('../models/incident.model');
 

exports.reportIncident = async (req, res) => {
  try {
    const incident = await Incident.create(req.body);
    res.status(201).json(incident);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  const incidents = await Incident.find();
  res.json(incidents);
};

exports.getIncidentsInBbox = async (req, res) => {
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
