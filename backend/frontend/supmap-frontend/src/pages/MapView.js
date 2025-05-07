import React, { useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";
import "../styles/MapView.css";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const center = { lat: 48.8566, lng: 2.3522 };

const MapView = () => {
  const [directions, setDirections] = useState(null);
  const [steps, setSteps] = useState([]);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [incident, setIncident] = useState("");
  const originRef = useRef(null);
  const destinationRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  useEffect(() => {
    if (isLoaded && originRef.current && destinationRef.current) {
      new window.google.maps.places.Autocomplete(originRef.current);
      new window.google.maps.places.Autocomplete(destinationRef.current);
    }
  }, [isLoaded]);

  const handleRouteSearch = (e) => {
    e.preventDefault();
    const service = new window.google.maps.DirectionsService();
    service.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
        avoidTolls: true,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
          const newSteps = result.routes[0].legs[0].steps.map((step, index) => ({
            id: index,
            instruction: step.instructions,
            distance: step.distance.text,
          }));
          setSteps(newSteps);
        } else {
          alert("Itinéraire non trouvé.");
        }
      }
    );
  };

  const handleStart = () => {
    alert("Navigation démarrée !");
  };

  const handleIncidentSubmit = () => {
    if (incident.trim() === "") return;
    alert(`Incident signalé : ${incident}`);
    setIncident("");
  };

  return (
    <div className="map-container">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-logo">Trafine</div>
        <ul className="navbar-menu">
          <li>Accueil</li>
          <li>Statistiques</li>
          <li>QR Code</li>
          <li>Profil</li>
        </ul>
      </nav>

      {/* FORMULAIRE ITINÉRAIRE */}
      <div className="route-search">
        <form onSubmit={handleRouteSearch}>
          <input
            type="text"
            placeholder="Origine"
            ref={originRef}
            onChange={(e) => setOrigin(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Destination"
            ref={destinationRef}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
          <button type="submit">Rechercher</button>
        </form>
        {directions && <button onClick={handleStart}>Démarrer</button>}
      </div>

      {/* GOOGLE MAP */}
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
        >
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{ suppressMarkers: false }}
            />
          )}
        </GoogleMap>
      )}

      {/* ÉTAPES DU TRAJET */}
      {steps.length > 0 && (
        <div className="alert-panel">
          <h4>Étapes du trajet :</h4>
          <ul>
            {steps.map((step) => (
              <li key={step.id}>
                <span dangerouslySetInnerHTML={{ __html: step.instruction }} /> ({step.distance})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* BOUTONS FLOTTANTS */}
      <div className="floating-buttons">
        <button onClick={() => alert("Scanner QR Code")}>QR Code</button>
        <button onClick={() => alert("Voir Statistiques")}>Statistiques</button>
        <button onClick={() => alert("Tableau de bord")}>Dashboard</button>
      </div>

      {/* SIGNALER UN INCIDENT */}
      <div className="incident-section">
        <h4>Signaler un incident</h4>
        <input
          type="text"
          placeholder="Ex: bouchon, accident, route barrée..."
          value={incident}
          onChange={(e) => setIncident(e.target.value)}
        />
        <button onClick={handleIncidentSubmit}>Envoyer</button>
      </div>
    </div>
  );
};

export default MapView;
