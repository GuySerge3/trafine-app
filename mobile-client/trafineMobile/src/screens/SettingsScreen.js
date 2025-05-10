import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Feather } from '@expo/vector-icons';
import styles from '../styles/SettingsScreen.styles';

const SettingsScreen = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Oui', onPress: logout }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Paramètres</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Feather name="log-out" size={20} color="#d00" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsScreen;
