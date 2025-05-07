import React, { useState } from "react";

const IncidentReport = ({ onReport }) => {
  const [incidentType, setIncidentType] = useState("Accident");
  const [description, setDescription] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const newIncident = {
      type: incidentType,
      description: description,
      time: new Date().toLocaleTimeString(),
    };

    // Appel de la fonction pour signaler l'incident
    onReport(newIncident);

    // Réinitialisation des champs du formulaire
    setIncidentType("Accident");
    setDescription("");
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f4f4f4", borderRadius: "8px" }}>
      <h3>Signaler un incident</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Type d'incident :
          <select value={incidentType} onChange={(e) => setIncidentType(e.target.value)}>
            <option value="Accident">Accident</option>
            <option value="Embouteillage">Embouteillage</option>
            <option value="Route fermée">Route fermée</option>
            <option value="Contrôle policier">Contrôle policier</option>
            <option value="Obstacle sur la route">Obstacle sur la route</option>
          </select>
        </label>
        <br />
        <label>
          Description :
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="4"
            style={{ width: "100%" }}
          />
        </label>
        <br />
        <button type="submit">Signaler</button>
      </form>
    </div>
  );
};

export default IncidentReport; 