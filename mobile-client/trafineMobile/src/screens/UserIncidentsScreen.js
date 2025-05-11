import React, { useEffect, useState } from "react";
import {
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Platform,
  View,
  TouchableOpacity,
} from "react-native";
import { incidentApi } from "../api/axios";
import {
  AlertTriangle,
  ShieldAlert,
  TrafficCone,
  Ban,
  AlertCircle,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const UserIncidentsScreen = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAllIncidents = async () => {
      try {
        const res = await incidentApi.get("/api/incidents");
        setIncidents(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (err) {
        console.error("❌ Erreur :", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllIncidents();
  }, []);

  const renderIcon = (type) => {
    const lower = type.toLowerCase();
    if (lower.includes("accident")) return <AlertTriangle size={24} color="orange" />;
    if (lower.includes("police")) return <ShieldAlert size={24} color="blue" />;
    if (lower.includes("embouteillage")) return <TrafficCone size={24} color="gold" />;
    if (lower.includes("route")) return <Ban size={24} color="red" />;
    return <AlertCircle size={24} color="gray" />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Incident")}
      >
        <Text style={styles.backButtonText}>← Retour</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Tous les incidents déclarés</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={incidents}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("MainTabs", {
                  screen: "MainTabs",  // Navigue vers l'écran Carte dans BottomTabNavigator
                  params: {
                    focusIncident: {
                      lat: item.location.coordinates[1],
                      lng: item.location.coordinates[0],
                    },
                  },
                });
              }}
            >
              <View style={styles.card}>
                <View style={styles.row}>
                  {renderIcon(item.type)}
                  <View style={{ marginLeft: 10, flex: 1 }}>
                    <Text style={styles.type}>{item.type}</Text>
                    {item.description && (
                      <Text style={styles.desc}>{item.description}</Text>
                    )}
                    {item.address && (
                      <Text style={styles.address}>📍 {item.address}</Text>
                    )}
                    <Text style={styles.date}>
                      {new Date(item.createdAt).toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default UserIncidentsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: Platform.OS === "android" ? 25 : 0,
    paddingHorizontal: 16,
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  type: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  desc: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
  address: {
    fontSize: 13,
    color: "#555",
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
});
