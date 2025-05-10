import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import incidentApi from '../api/axios';


const UserIncidentsScreen = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyIncidents = async () => {
      try {
        const res = await incidentApi.get("/api/incidents/mine");
        setIncidents(res.data);
      } catch (err) {
        console.error("❌ Erreur :", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyIncidents();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes incidents déclarés</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={incidents}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.type}>{item.type}</Text>
              <Text style={styles.desc}>{item.description}</Text>
              <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default UserIncidentsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  card: { backgroundColor: "#fff", padding: 16, marginBottom: 12, borderRadius: 8 },
  type: { fontSize: 16, fontWeight: "600", color: "#007AFF" },
  desc: { fontSize: 14, color: "#333", marginTop: 4 },
  date: { fontSize: 12, color: "#999", marginTop: 4 },
});
