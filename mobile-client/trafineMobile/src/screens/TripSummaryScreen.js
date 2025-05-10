// ✅ TripSummaryScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Polyline } from "react-native-maps";
import { Feather } from "@expo/vector-icons";

const TripSummaryScreen = ({ route, navigation }) => {
  const { routeCoords, summary, from, to, steps } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛣 Trajet de</Text>
      <Text style={styles.subtitle}>{from} ➜ {to}</Text>

      <MapView style={styles.map}>
        <Polyline coordinates={routeCoords} strokeColor="blue" strokeWidth={4} />
      </MapView>

      <View style={styles.info}>
        <Text style={styles.detail}>📏 Distance : {summary.distance} km</Text>
        <Text style={styles.detail}>⏱ Durée : {summary.duration} min</Text>
        <Text style={styles.detail}>🚧 Incidents : {summary.incidents}</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#6c757d' }]}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={18} color="#fff" />
          <Text style={styles.buttonText}>Retour</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => alert("Fonctionnalité à venir")}
        >
          <Feather name="share-2" size={18} color="#fff" />
          <Text style={styles.buttonText}>Partager</Text>
        </TouchableOpacity>
      </View>

      {/* 🚗 Start Navigation Floating Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() =>
          navigation.navigate("Navigation", {
            routeCoords,
            steps,
          })
        }
      >
        <Feather name="navigation" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    alignItems: "center",
    backgroundColor: "#007bff",
    borderRadius: 8,
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonRow: { flexDirection: "row", justifyContent: "space-between" },
  buttonText: { color: "white", fontWeight: "bold", marginLeft: 8 },
  container: { flex: 1, padding: 15 },
  detail: { fontSize: 16, marginBottom: 5 },
  floatingButton: {
    alignItems: "center",
    backgroundColor: "#007bff",
    borderRadius: 25,
    bottom: 30,
    elevation: 4,
    height: 50,
    justifyContent: "center",
    position: "absolute",
    right: 20,
    width: 50,
  },
  info: { marginBottom: 20 },
  map: { borderRadius: 10, height: 240, marginBottom: 20 },
  subtitle: { color: "#555", fontSize: 16, marginBottom: 10 },
  title: { fontSize: 20, fontWeight: "bold" },
});

export default TripSummaryScreen;
