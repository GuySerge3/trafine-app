import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import io from 'socket.io-client';
import styles from '../styles/AlertScreen.styles';
import axios from '../api/axios';

const AlertScreen = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Charger les alertes récentes
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

    // 2. WebSocket via Gateway en HTTP
    const socket = io('http://10.139.91.203:3000', {
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
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.timestamp}>{new Date(item.createdAt).toLocaleString()}</Text>
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
