import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getRoute } from "../components/RouteService";
import IncidentReport from "../components/IncidentReport";
import AlertNotification from "../components/AlertNotification";
import QRGenerator from "../components/QRGenerator";

const MapView = () => {
  const [routeOptions, setRouteOptions] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [avoidTolls, setAvoidTolls] = useState(false);
  const start = { lat: 48.8566, lon: 2.3522 }; // Paris
  const end = { lat: 48.8584, lon: 2.2945 }; // Tour Eiffel

  useEffect(() => {
    const fetchRoutes = async () => {
      const routes = await getRoute(start, end, avoidTolls);
      console.log(routes); // Vérifie la structure des données reçues

      if (routes && routes.length > 0 && routes[0].geometry && routes[0].geometry.coordinates) {
        setRouteOptions(routes);
        setSelectedRoute(routes[0].geometry.coordinates); // Définir selectedRoute seulement si les données sont valides
      } else {
        console.error("Aucune route disponible ou données incorrectes.");
      }
    };

    fetchRoutes();
  }, [avoidTolls]);

  const handleReportIncident = (incident) => {
    setIncidents([...incidents, incident]);
    setAlerts([...alerts, incident]); // Ajouter l'alerte à la liste
  };

  const handleRouteSelection = (route) => {
    setSelectedRoute(route.geometry.coordinates);
  };

  return (
    <div>
      <h2>Carte en temps réel</h2>
      <div>
        <label>
          Éviter les péages :
          <input
            type="checkbox"
            checked={avoidTolls}
            onChange={() => setAvoidTolls(!avoidTolls)}
          />
        </label>
      </div>

      <MapContainer center={[48.8566, 2.3522]} zoom={13} style={{ height: "500px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Rendu conditionnel de la Polyline */}
        {selectedRoute && selectedRoute.length > 0 && (
          <Polyline positions={selectedRoute} color="blue" />
        )}
        {/* Rendu des incidents */}
        {incidents.map((incident, index) => (
          <Marker key={index} position={[48.8566, 2.3522]}>
            <Popup>
              <h4>{incident.type}</h4>
              <p>{incident.description}</p>
              <p>{incident.time}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Rendu des alertes */}
      {alerts.map((alert, index) => (
        <AlertNotification key={index} incident={alert} />
      ))}

      {/* Formulaire de déclaration d'incidents */}
      <IncidentReport onReport={handleReportIncident} />

      {/* Générateur de QR Code */}
      <QRGenerator route={selectedRoute} />

      {/* Liste des itinéraires disponibles */}
      <div>
        <h3>Choisissez votre itinéraire :</h3>
        <ul>
          {routeOptions.map((route, index) => (
            <li key={index} onClick={() => handleRouteSelection(route)}>
              {route.legs[0].summary} - {route.duration / 60} minutes
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MapView;
