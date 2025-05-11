import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, Alert, ActivityIndicator } from "react-native";
import { AuthContext } from "../context/AuthContext";
import styles from "../styles/LoginScreen.styles";
import { api } from "../api/axios";
import { Feather } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Champs requis", "Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", {
        email: email.toLowerCase(),
        password,
      });

      console.log("✅ Réponse login:", res.data);

      // Stocker uniquement dans l'état global, pas dans AsyncStorage
      login(res.data.token);  // Utiliser le token pour mettre à jour l'état dans AuthContext
      navigation.navigate("MainTabs");  // Naviguer vers les écrans principaux
    } catch (err) {
      console.error("❌ Erreur de connexion:", err.response?.data || err.message);
      Alert.alert(
        "Erreur",
        err.response?.data?.error || "Impossible de se connecter."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion à SupMap</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <>
          <View style={styles.buttonContainer}>
            <Button title="Se connecter" onPress={handleLogin} color="#007AFF" />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="S'inscrire"
              onPress={() => navigation.navigate("Register")}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default LoginScreen;
