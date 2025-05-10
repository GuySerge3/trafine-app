import React from 'react';
import { View, Text } from 'react-native';
import styles from '../styles/ProfileScreen.styles';

const ProfileScreen = () => {
  // 🚧 Tu brancheras ça plus tard avec le contexte utilisateur
  const fakeUser = {
    name: 'Serge',
    email: 'serge@example.com',
    role: 'admin'
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Profil utilisateur</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Nom :</Text>
        <Text style={styles.value}>{fakeUser.name}</Text>

        <Text style={styles.label}>Email :</Text>
        <Text style={styles.value}>{fakeUser.email}</Text>

        <Text style={styles.label}>Rôle :</Text>
        <Text style={styles.value}>{fakeUser.role}</Text>
      </View>
    </View>
  );
};

export default ProfileScreen;
