import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import io from 'socket.io-client';
import styles from '../styles/AlertScreen.styles';
import axios from '../api/axios';
import Icon from 'react-native-vector-icons/FontAwesome';  // Importer FontAwesome

const AlertScreen = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await axios.get('/api/alerts/recent');
        setAlerts(res.data.reverse());
      } catch (err) {
        console.error('❌ Erreur lors du chargement des alertes :', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();

    const socket = io('http://10.139.91.203:5000', {
      transports: ['websocket']
    });

    socket.on('connect', () => {
      console.log('✅ Connecté au WebSocket via Gateway HTTP');
    });

    socket.on('new-alert', (data) => {
      setAlerts(prev => [data, ...prev]);
    });

    return () => socket.disconnect();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.alertCard}>
      <View style={styles.row}>
        {/* Affichage de l'icône avec react-native-vector-icons */}
        <Icon name="exclamation-circle" size={24} color="orange" />  {/* Exemple d'icône d'alerte */}
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={styles.message}>{item.message}</Text>
          <Text style={styles.timestamp}>{new Date(item.createdAt).toLocaleString()}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔔 Alertes en direct</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#333" />
      ) : (
        <FlatList
          data={alerts}
          keyExtractor={(_, i) => i.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

export default AlertScreen;
