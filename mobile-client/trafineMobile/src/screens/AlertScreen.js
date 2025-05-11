import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import io from 'socket.io-client';  // Importer le client Socket.io

const AlertScreen = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Connexion au serveur WebSocket
    const socket = io('http://192.168.1.48:5000'); // Adresse du serveur WebSocket

    socket.on('connect', () => {
      console.log('Connecté au WebSocket!');
      socket.emit('message', 'Hello, serveur!'); // Envoi d'un message au serveur
    });

    // Réception des messages du serveur
    socket.on('message', (msg) => {
      console.log('Message du serveur:', msg);
    });

    // Simulation de réception des alertes (ici, tu devrais mettre ta logique)
    socket.on('new-alert', (data) => {
      setAlerts((prevAlerts) => [data, ...prevAlerts]);
    });

    // Déconnexion du WebSocket lors de la destruction du composant
    return () => socket.disconnect();
  }, []);

  return (
    <View>
      <Text>Alertes en direct</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#333" />
      ) : (
        <FlatList
          data={alerts}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View>
              <Text>{item.message}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default AlertScreen;
