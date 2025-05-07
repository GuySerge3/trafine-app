"use client"

import { useState } from "react"
import { AlertTriangle, MapIcon, Clock } from "lucide-react"
import "../styles/Incidents.css"

const Incidents = ({ navigateTo }) => {
  const [activeTab, setActiveTab] = useState("all")

  // Données d'exemple pour les incidents
  const incidents = [
    {
      id: 1,
      type: "accident",
      location: "Boulevard Périphérique, Porte de Vincennes",
      time: "Il y a 15 minutes",
      description: "Accident impliquant 2 véhicules sur la voie de droite",
      severity: "high",
    },
    {
      id: 2,
      type: "traffic",
      location: "A1, Direction Paris",
      time: "Il y a 30 minutes",
      description: "Embouteillage important sur 5km",
      severity: "medium",
    },
    {
      id: 3,
      type: "roadwork",
      location: "Avenue des Champs-Élysées",
      time: "Il y a 2 heures",
      description: "Travaux de voirie, circulation sur une seule voie",
      severity: "low",
    },
    {
      id: 4,
      type: "accident",
      location: "Place de la Concorde",
      time: "Il y a 45 minutes",
      description: "Accident entre un vélo et une voiture",
      severity: "medium",
    },
    {
      id: 5,
      type: "traffic",
      location: "Tunnel du Landy, A86",
      time: "Il y a 10 minutes",
      description: "Ralentissement important suite à un véhicule en panne",
      severity: "medium",
    },
  ]

  // Filtrer les incidents selon l'onglet actif
  const filteredIncidents =
    activeTab === "all" ? incidents : incidents.filter((incident) => incident.type === activeTab)

  return (
    <div className="content">
      <div className="incidents-header">
        <h1>Incidents</h1>
        <button className="report-button">
          <AlertTriangle size={16} />
          Signaler un incident
        </button>
      </div>

      <div className="incidents-tabs">
        <button className={`tab ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>
          Tous
        </button>
        <button className={`tab ${activeTab === "accident" ? "active" : ""}`} onClick={() => setActiveTab("accident")}>
          Accidents
        </button>
        <button className={`tab ${activeTab === "traffic" ? "active" : ""}`} onClick={() => setActiveTab("traffic")}>
          Embouteillages
        </button>
        <button className={`tab ${activeTab === "roadwork" ? "active" : ""}`} onClick={() => setActiveTab("roadwork")}>
          Travaux
        </button>
      </div>

      <div className="incidents-list">
        {filteredIncidents.length === 0 ? (
          <div className="no-incidents">
            <AlertTriangle size={40} />
            <p>Aucun incident à afficher</p>
          </div>
        ) : (
          filteredIncidents.map((incident) => (
            <div key={incident.id} className={`incident-card severity-${incident.severity}`}>
              <div className="incident-icon">
                {incident.type === "accident" && <AlertTriangle size={24} />}
                {incident.type === "traffic" && <Clock size={24} />}
                {incident.type === "roadwork" && <MapIcon size={24} />}
              </div>
              <div className="incident-details">
                <div className="incident-header">
                  <h3>
                    {incident.type === "accident" && "Accident"}
                    {incident.type === "traffic" && "Embouteillage"}
                    {incident.type === "roadwork" && "Travaux"}
                  </h3>
                  <span className="incident-time">{incident.time}</span>
                </div>
                <p className="incident-location">{incident.location}</p>
                <p className="incident-description">{incident.description}</p>
              </div>
              <div className="incident-actions">
                <button className="view-button" onClick={() => navigateTo("map")}>
                  Voir sur la carte
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Incidents
