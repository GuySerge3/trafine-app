import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import styles from './RegisterScreen.styles';

const RegisterScreen = ({ navigation }) => {
  const { register } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await register(email, password);
      alert('Compte créé ! Connectez-vous');
      navigation.navigate('Login');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

export default RegisterScreen;
