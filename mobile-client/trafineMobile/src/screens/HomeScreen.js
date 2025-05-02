import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import styles from './HomeScreen.styles';

const HomeScreen = () => {
  const { logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur Trafine Mobile 🚀</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

export default HomeScreen;
