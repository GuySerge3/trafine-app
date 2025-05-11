import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import {
  AlertTriangle,
  ShieldAlert,
  TrafficCone,
  Ban,
  AlertCircle,
} from "lucide-react-native";
import * as Location from "expo-location";
import routeApi from "../api/axiosRoute";
import styles from "../styles/MapScreen.styles";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { Feather } from "@expo/vector-icons";
import axios from "axios";

const MapScreen = () => {
  const { logout } = useContext(AuthContext);
  const route = useRoute();
  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");
  const [fromResults, setFromResults] = useState([]);
  const [toResults, setToResults] = useState([]);
  const [fromCoord, setFromCoord] = useState(null);
  const [toCoord, setToCoord] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [steps, setSteps] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isRouteConfirmed, setIsRouteConfirmed] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const navigation = useNavigation();
  const mapRef = useRef(null);

  const search = async (query, setResults) => {
    if (query.length < 3) return;
    try {
      const res = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: { q: query, format: "json", limit: 5 },
          headers: { "User-Agent": "trafine-app" },
        }
      );
      setResults(res.data);
    } catch (err) {
      console.error("Nominatim error:", err.message);
    }
  };

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission refusée", "La localisation est nécessaire.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setCurrentLocation({ latitude, longitude });
      setFromCoord({ latitude, longitude });

      try {
        const response = await axios.get(
          "https://nominatim.openstreetmap.org/reverse",
          {
            params: { lat: latitude, lon: longitude, format: "json" },
            headers: { "User-Agent": "trafine-app" },
          }
        );

        const address = response.data.display_name;
        setFromQuery(address);
      } catch (error) {
        console.error("Erreur reverse geocoding :", error.message);
      }
    };

    getLocation();
  }, []);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await axios.get("http://192.168.1.48:3004/api/incidents");
        setIncidents(res.data);
      } catch (error) {
        console.error("Erreur incidents :", error.message);
      }
    };
    fetchIncidents();
  }, []);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const res = await routeApi.post("/api/routes", {
          from: [fromCoord.longitude, fromCoord.latitude],
          to: [toCoord.longitude, toCoord.latitude],
        });

        const coords = res.data?.route;
        if (coords && coords.length > 0) {
          setRouteCoords(coords);
          setSteps(res.data.steps);
        } else {
          setRouteCoords([]);
        }

        setSummary({
          distance: res.data.distance_km,
          duration: res.data.duration_min,
          incidents: res.data.incidents.length,
          steps: res.data.steps,
        });
      } catch (err) {
        console.error("Erreur backend :", err.response?.data || err.message);
        Alert.alert("Erreur trajet", err.message);
      }
    };

    if (!fromCoord || !toCoord || !isRouteConfirmed) return;
    fetchRoute();
  }, [fromCoord, toCoord, isRouteConfirmed]);

  useEffect(() => {
    const incident = route?.params?.focusIncident;
    if (incident && mapRef.current) {
      const { latitude, longitude } = incident;
      mapRef.current.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  }, [route?.params?.focusIncident]);


  return (
    <View style={styles.container}>
      {currentLocation && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker
            coordinate={currentLocation}
            title="Vous êtes ici"
            pinColor="blue"
          />
          {fromCoord && <Marker coordinate={fromCoord} title="Départ" />}
          {toCoord && <Marker coordinate={toCoord} title="Arrivée" />}
          {routeCoords.length > 0 && (
            <Polyline
              coordinates={routeCoords}
              strokeColor="blue"
              strokeWidth={4}
            />
          )}
          {incidents
            .filter(
              (i) =>
                i.location &&
                i.location.coordinates &&
                i.location.coordinates.length === 2
            )
            .map((incident) => (
              <Marker
                key={incident._id}
                coordinate={{
                  latitude: incident.location.coordinates[1],
                  longitude: incident.location.coordinates[0],
                }}
                title={`Incident: ${incident.type}`}
                description={incident.description || "Aucun détail"}
              >
                {incident.type.toLowerCase().includes("accident") ? (
                  <AlertTriangle size={30} color="orange" />
                ) : incident.type.toLowerCase().includes("police") ? (
                  <ShieldAlert size={30} color="blue" />
                ) : incident.type.toLowerCase().includes("embouteillage") ? (
                  <TrafficCone size={30} color="gold" />
                ) : incident.type.toLowerCase().includes("route") ? (
                  <Ban size={30} color="red" />
                ) : (
                  <AlertCircle size={30} color="gray" />
                )}
              </Marker>
            ))}
        </MapView>
      )}

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() =>
          Alert.alert(
            "Déconnexion",
            "Voulez-vous vraiment vous déconnecter ?",
            [
              { text: "Annuler", style: "cancel" },
              { text: "Oui", onPress: logout },
            ]
          )
        }
      >
        <Feather name="log-out" size={22} color="#d00" />
      </TouchableOpacity>

      {currentLocation && (
        <TouchableOpacity
          style={styles.recenterButton}
          onPress={() => {
            mapRef.current?.animateToRegion({
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            });
          }}
        >
          <Feather name="crosshair" size={22} color="#007bff" />
        </TouchableOpacity>
      )}

      {summary && isRouteConfirmed && (
        <>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryText}>
              🛣 Distance : {summary.distance} km
            </Text>
            <Text style={styles.summaryText}>
              ⏱ Durée : {summary.duration} min
            </Text>
            <Text style={styles.summaryText}>
              🚧 Incidents : {summary.incidents}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.circleButton}
            onPress={() => {
              navigation.navigate("Navigation", {
                routeCoords,
                steps,
                duration_min: summary?.duration,
                toCoord,
              });
            }}
          >
            <Feather name="navigation" size={24} color="#fff" />
          </TouchableOpacity>
        </>
      )}

      {/* Recherche départ/destination conservée ci-dessous (non modifiée) */}
      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <Feather
            name="map-pin"
            size={18}
            color="green"
            style={styles.iconSpacing}
          />
          <TextInput
            placeholder="Point de départ"
            value={fromQuery}
            onChangeText={(text) => {
              setFromQuery(text);
              search(text, setFromResults);
            }}
            style={[styles.searchInput, { flex: 1 }]}
            editable={!isRouteConfirmed}
            autoCapitalize="none"
          />
        </View>

        {fromQuery.length > 2 && fromResults.length > 0 && (
          <FlatList
            data={fromResults}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setFromCoord({
                    latitude: parseFloat(item.lat),
                    longitude: parseFloat(item.lon),
                  });
                  setFromQuery(item.display_name);
                  setFromResults([]);
                }}
                style={styles.resultItem}
              >
                <Text>{item.display_name}</Text>
              </TouchableOpacity>
            )}
            style={styles.resultList}
          />
        )}

        <View style={styles.searchRow}>
          <Feather
            name="flag"
            size={18}
            color="red"
            style={styles.iconSpacing}
          />
          <TextInput
            placeholder="Destination"
            value={toQuery}
            onChangeText={(text) => {
              setToQuery(text);
              search(text, setToResults);
            }}
            style={[styles.searchInput, { flex: 1 }]}
            editable={!isRouteConfirmed}
            autoCapitalize="none"
          />
        </View>

        {toQuery.length > 2 && toResults.length > 0 && (
          <FlatList
            data={toResults}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setToCoord({
                    latitude: parseFloat(item.lat),
                    longitude: parseFloat(item.lon),
                  });
                  setToQuery(item.display_name);
                  setToResults([]);
                }}
                style={styles.resultItem}
              >
                <Text>{item.display_name}</Text>
              </TouchableOpacity>
            )}
            style={[styles.resultList, { marginTop: 105 }]}
          />
        )}

        {fromCoord && toCoord && !isRouteConfirmed && (
          <TouchableOpacity
            style={styles.validateButton}
            onPress={() => {
              Alert.alert(
                "Confirmer le trajet",
                "Souhaitez-vous valider ce trajet ?",
                [
                  { text: "Annuler", style: "cancel" },
                  { text: "Valider", onPress: () => setIsRouteConfirmed(true) },
                ]
              );
            }}
          >
            <Text style={styles.validateButtonText}>Valider le trajet</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default MapScreen;
