import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import styles from "../styles/IncidentReportScreen.styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { incidentApi } from "../api/axios"; // ✅ Ajout pour faire l'appel POST

const IncidentScreen = () => {
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission refusée", "La localisation est nécessaire.");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    };

    fetchLocation();
  }, []);

  const handleReport = async () => {
    if (!type || !description || !location) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    try {
      const body = {
        type,
        description,
        location: {
          type: "Point",
          coordinates: [location.longitude, location.latitude],
        },
      };

      const res = await incidentApi.post("/api/incidents", body); // ✅ POST au backend
      console.log("✅ Incident enregistré :", res.data);
      Alert.alert("Merci", "Incident signalé avec succès !");
      setType("");
      setDescription("");
    } catch (error) {
      console.error("❌ Erreur lors de la création :", error.message);
      Alert.alert("Erreur", "Impossible d'enregistrer l'incident.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.replace("MainTabs")}
      >
        <Text style={styles.backButtonText}>← Retour</Text>
      </TouchableOpacity>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Signaler un incident</Text>

        <TextInput
          placeholder="Type d'incident (ex: accident, bouchon)"
          value={type}
          onChangeText={setType}
          style={styles.input}
        />

        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          style={[styles.input, { height: 100 }]}
        />

        {location && (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker coordinate={location} title="Votre position" />
          </MapView>
        )}

        <TouchableOpacity style={styles.button} onPress={handleReport}>
          <Text style={styles.buttonText}>Envoyer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#ccc", marginTop: 12 }]}
          onPress={() => navigation.navigate("UserIncidents")}
        >
          <Text style={styles.buttonText}>Voir mes incidents</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default IncidentScreen;
