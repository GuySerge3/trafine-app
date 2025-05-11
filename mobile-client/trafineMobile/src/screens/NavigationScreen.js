import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { Car, MapPin } from "lucide-react-native"; // ✅ icônes vectorielles

const NavigationScreen = ({ route }) => {
  const { routeCoords, steps, duration_min, toCoord } = route.params;
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const mapRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    const watchPosition = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (loc) => {
          setCurrentLocation(loc.coords);
        }
      );
    };

    watchPosition();
  }, []);

  useEffect(() => {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [currentLocation]);

  return (
    <View style={styles.container}>
      {/* Durée du trajet */}
      <View style={styles.topBar}>
        <Text style={styles.durationText}>
          ⏱️ Durée estimée : {duration_min} min
        </Text>
      </View>

      <MapView ref={mapRef} style={styles.map}>
        {routeCoords && (
          <Polyline
            coordinates={routeCoords}
            strokeColor="blue"
            strokeWidth={4}
          />
        )}
        {currentLocation && (
          <Marker coordinate={currentLocation} title="Ma position">
            <Car size={28} color="#007bff" />
          </Marker>
        )}
        {toCoord && (
          <Marker coordinate={toCoord} title="Destination">
            <MapPin size={28} color="green" />
          </Marker>
        )}
      </MapView>

      {/* Instructions */}
      <View style={styles.instructionBox}>
        <Text style={styles.instructionText}>🧭 Étape actuelle :</Text>
        <Text style={styles.stepText}>
          {typeof steps?.[currentStep]?.instruction === "string"
            ? steps[currentStep].instruction
            : "En route..."}
        </Text>
      </View>

      {/* Quitter navigation */}
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.navigate("MainTabs")}
      >
        <Text style={styles.cancelButtonText}>🛑 Quitter la navigation</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  topBar: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    zIndex: 1,
    elevation: 5,
  },
  durationText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  instructionBox: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  instructionText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  stepText: {
    fontSize: 15,
    textAlign: "center",
    color: "#333",
  },
  cancelButton: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    padding: 14,
    backgroundColor: "#d9534f",
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default NavigationScreen;
