import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';  // Contexte d'authentification
import { Feather } from '@expo/vector-icons';
import styles from '../styles/SettingsScreen.styles';

const SettingsScreen = () => {
  const { logout } = useContext(AuthContext);  // Récupère la fonction logout depuis le contexte

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Oui', onPress: logout },  // Déconnexion de l'utilisateur
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Paramètres</Text>

      {/* Section Déconnexion */}
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
