import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";

const NavigationScreen = ({ route }) => {
  const { routeCoords, steps } = route.params;
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const mapRef = useRef(null);

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
      <MapView ref={mapRef} style={styles.map}>
        {routeCoords && (
          <Polyline coordinates={routeCoords} strokeColor="blue" strokeWidth={4} />
        )}
        {currentLocation && (
          <Marker coordinate={currentLocation} title="Ma position" pinColor="red" />
        )}
      </MapView>

      <View style={styles.instructionBox}>
        <Text style={styles.instructionText}>
          🧭 Étape actuelle : {steps?.[currentStep] || "En route..."}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  instructionBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    bottom: 20,
    elevation: 5,
    left: 15,
    padding: 15,
    position: "absolute",
    right: 15,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  instructionText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  map: { flex: 1 },
});

export default NavigationScreen;
