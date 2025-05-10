import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { X } from "lucide-react-native";

const NavigationScreen = ({ route }) => {
  const { routeCoords, steps } = route.params;
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

  const handleCancel = () => {
    Alert.alert(
      "Arrêter la navigation",
      "Voulez-vous revenir à la carte ?",
      [
        { text: "Non", style: "cancel" },
        { text: "Oui", onPress: () => navigation.navigate("MainTabs") },
      ]
    );
  };

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

        <ScrollView style={styles.stepList}>
          {steps?.map((step, index) => (
            <Text key={index} style={styles.stepItem}>
              {index + 1}. {step}
            </Text>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
        <X color="#fff" size={22} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  instructionBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    bottom: 80,
    elevation: 5,
    left: 15,
    padding: 15,
    position: "absolute",
    right: 15,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    maxHeight: 200,
  },
  instructionText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  stepList: {
    maxHeight: 120,
  },
  stepItem: {
    fontSize: 14,
    marginVertical: 2,
  },
  cancelButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#d00",
    padding: 14,
    borderRadius: 50,
    elevation: 4,
  },
});

export default NavigationScreen;
