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
import * as Location from "expo-location";
import routeApi from "../api/axiosRoute";
import styles from "../styles/MapScreen.styles";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { Feather } from "@expo/vector-icons";
import axios from "axios";

const MapScreen = () => {
  const { logout } = useContext(AuthContext);
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
    const fetchRoute = async () => {
      try {
        console.log("📲 Envoi au backend : ", {
          from: [fromCoord.longitude, fromCoord.latitude],
          to: [toCoord.longitude, toCoord.latitude],
        });
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
        console.error("❌ Erreur backend :", err.response?.data || err.message);
        Alert.alert("Erreur trajet", err.message);
      }
    };

    if (!fromCoord || !toCoord || !isRouteConfirmed) return;

    fetchRoute();
  }, [fromCoord, toCoord, isRouteConfirmed]);

  useEffect(() => {
    if (routeCoords.length > 0 && mapRef.current) {
      mapRef.current.fitToCoordinates(routeCoords, {
        edgePadding: { top: 50, bottom: 50, left: 50, right: 50 },
        animated: true,
      });
    }
  }, [routeCoords]);

  return (
    <View style={styles.container}>
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

      <View style={styles.searchContainer}>
        {/* Point de départ */}
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
          {fromQuery.length > 0 && !isRouteConfirmed && (
            <TouchableOpacity onPress={() => setFromQuery("")}>
              <Text>
                <Feather name="x-circle" size={18} color="#999" />
              </Text>
            </TouchableOpacity>
          )}
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
            style={[styles.resultList, { top: 35 }]}
          />
        )}

        {/* Destination */}
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
          {toQuery.length > 0 && !isRouteConfirmed && (
            <TouchableOpacity onPress={() => setToQuery("")}>
              <Text>
                <Feather name="x-circle" size={18} color="#999" />
              </Text>
            </TouchableOpacity>
          )}
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
            style={[styles.resultList, { top: 105 }]}
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
        </MapView>
      )}

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
              });
            }}
          >
            <Feather name="navigation" size={24} color="#fff" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default MapScreen;
