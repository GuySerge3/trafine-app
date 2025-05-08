"use client"
import { Link } from "react-router-dom"
import { useState, useRef, useEffect } from "react"
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api"
import "../styles/MapView.css"
import { MapPin, Bell, LogOut } from "lucide-react"

const containerStyle = {
  width: "100%",
  height: "100vh",
}

const center = { lat: 48.8566, lng: 2.3522 }

const MapView = () => {
  const [directions, setDirections] = useState(null)
  const [steps, setSteps] = useState([])
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const originRef = useRef(null)
  const destinationRef = useRef(null)

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  })

  useEffect(() => {
    if (isLoaded && originRef.current && destinationRef.current) {
      new window.google.maps.places.Autocomplete(originRef.current)
      new window.google.maps.places.Autocomplete(destinationRef.current)
    }
  }, [isLoaded])

  const handleRouteSearch = (e) => {
    e.preventDefault()
    const service = new window.google.maps.DirectionsService()
    service.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
        avoidTolls: true,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result)
          const newSteps = result.routes[0].legs[0].steps.map((step, index) => ({
            id: index,
            instruction: step.instructions,
            distance: step.distance.text,
          }))
          setSteps(newSteps)
        } else {
          alert("Itinéraire non trouvé.")
        }
      },
    )
  }

  const handleStart = () => {
    alert("Navigation démarrée !")
  }

  return (
    <div className="map-container">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-logo">
          <MapPin className="mappin-icon" />
          <span>SUPMAP</span>
        </div>
        <ul className="navbar-menu">
          <li><Link to="/">Accueil</Link></li>
          <li><Link to="/incidents">Incidents</Link></li>
          <li><Link to="/profil">Profil</Link></li>
          <li><Link to="/statistiques">Statistiques</Link></li>
          <li><Link to="/profil">Profil</Link></li>
          <li className="icon-item">
            <Bell size={20} />
          </li>
          <li className="icon-item">
            <LogOut size={20} />
          </li>
      </ul>

      </nav>

      {/* ITINERAIRE FORM */}
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

      {/* MAP */}
      {isLoaded && (
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
          {directions && <DirectionsRenderer directions={directions} options={{ suppressMarkers: false }} />}
        </GoogleMap>
      )}

      {/* ALERT PANEL POUR LES ÉTAPES */}
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
    </div>
  )
}

export default MapView
