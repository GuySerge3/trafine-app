import { Link, useNavigate } from "react-router-dom"
import { useState, useRef, useEffect } from "react"
import {
  GoogleMap,
  DirectionsRenderer,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api"
import { MapPin, Bell, LogOut, LocateFixed } from "lucide-react"
import "../styles/MapView.css"

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "20px",
  overflow: "hidden",
}

const center = { lat: 48.8566, lng: 2.3522 }

const MapView = () => {
  const [directions, setDirections] = useState(null)
  const [steps, setSteps] = useState([])
  const [theme, setTheme] = useState("light")
  const [currentPosition, setCurrentPosition] = useState(null)
  const [showInfo, setShowInfo] = useState(false)

  const originRef = useRef(null)
  const destinationRef = useRef(null)
  const originAutocomplete = useRef(null)
  const destinationAutocomplete = useRef(null)
  const navigate = useNavigate()
  const mapRef = useRef(null)

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  })

  useEffect(() => {
    if (isLoaded && originRef.current && destinationRef.current) {
      originAutocomplete.current = new window.google.maps.places.Autocomplete(originRef.current)
      destinationAutocomplete.current = new window.google.maps.places.Autocomplete(destinationRef.current)
    }
  }, [isLoaded])

  const handleRouteSearch = (e) => {
    e.preventDefault()

    const origin = originRef.current.value
    const destination = destinationRef.current.value

    if (!origin || !destination) {
      alert("Veuillez saisir une origine et une destination valides.")
      return
    }

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
      }
    )
  }

  const handleStart = () => {
    document.getElementById("steps-panel").classList.add("open")
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login")
  }

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
    document.body.className = theme === "light" ? "dark-mode" : ""
  }

  const locateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setCurrentPosition(pos)
          mapRef.current?.panTo(pos)
          mapRef.current?.setZoom(15)
          setShowInfo(true)
        },
        () => {
          alert("Erreur : Impossible d'obtenir votre position.")
        }
      )
    }
  }

  return (
    <div className={`map-container ${theme}`}>
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
          <li className="icon-item"><Bell size={20} /></li>
          <li className="icon-item" onClick={handleLogout}><LogOut size={20} /></li>
        </ul>
        <div className="theme-switch">
          <label className="switch">
            <input type="checkbox" onChange={toggleTheme} />
            <span className="slider round"></span>
          </label>
        </div>
      </nav>

      {/* FORMULAIRE */}
      <div className="route-search">
        <form onSubmit={handleRouteSearch}>
          <input type="text" placeholder="Origine" ref={originRef} required />
          <input type="text" placeholder="Destination" ref={destinationRef} required />
          <button type="submit">Rechercher</button>
        </form>
        {directions && <button className="start-btn" onClick={handleStart}>Démarrer</button>}
      </div>

      {/* CARTE */}
      <div className="map-wrapper">
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
            onLoad={(map) => (mapRef.current = map)}
          >
            {directions && <DirectionsRenderer directions={directions} />}

            {currentPosition && (
              <>
                <Marker
                  position={currentPosition}
                  onClick={() => setShowInfo(true)}
                  icon={{
                    url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                  }}
                />
                {showInfo && (
                  <InfoWindow
                    position={{
                      lat: currentPosition.lat + 0.0005, // légèrement au-dessus
                      lng: currentPosition.lng,
                    }}
                    onCloseClick={() => setShowInfo(false)}
                  >
                    <div className="custom-info-window">📍 Vous êtes ici</div>
                  </InfoWindow>
                )}
              </>
            )}
          </GoogleMap>
        )}

        {/* BOUTON GEOLOCALISATION */}
        <div className="locate-button" onClick={locateMe} title="Ma position">
          <LocateFixed size={20} />
        </div>
        <div className="locate-label">Ma position</div>
      </div>

      {/* PANEL DES ÉTAPES */}
      {steps.length > 0 && (
        <div className="steps-panel" id="steps-panel">
          <div className="steps-header">
            <h4>Étapes du trajet :</h4>
            <button onClick={() => document.getElementById("steps-panel").classList.remove("open")}>Fermer</button>
          </div>
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
