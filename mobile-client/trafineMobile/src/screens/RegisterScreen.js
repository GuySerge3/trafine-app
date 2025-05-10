import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { AuthContext } from "../context/AuthContext";

const RegisterScreen = ({ navigation }) => {
  const { register } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Champs requis", "Veuillez remplir tous les champs.");
      return;
    }

    try {
      await register(email.toLowerCase(), password);
      Alert.alert("Succès", "Compte créé avec succès. Connectez-vous.");
      navigation.navigate("Login");
    } catch (err) {
      console.error("❌ Erreur d'inscription:", err);
      Alert.alert("Erreur", err.response?.data?.error || "Erreur lors de l'inscription.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* 🌍 Animation de la planète */}
        <LottieView
          source={require("../assets/lottie/earth.json")}
          autoPlay
          loop
          style={styles.earth}
        />

        {/* 📍 Logo en haut */}
        <View style={styles.logoContainer}>
          <MaterialIcons name="location-on" size={30} color="#007AFF" />
        </View>

        <Text style={styles.title}>Créer un compte</Text>

        {/* Champ email */}
        <View style={styles.inputWrapper}>
          <MaterialIcons name="email" size={20} color="#007AFF" style={styles.icon} />
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Champ mot de passe */}
        <View style={styles.inputWrapper}>
          <MaterialIcons name="lock" size={20} color="#007AFF" style={styles.icon} />
          <TextInput
            placeholder="Mot de passe"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* Bouton s'inscrire */}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>S'inscrire</Text>
        </TouchableOpacity>

        {/* Lien vers la page login */}
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9F9F9',
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  earth: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 180,
    height: 180,
    opacity: 19,
    zIndex: -1,
  },
  logoContainer: {
    position: 'absolute',
    top: 50,
    left: 24,
    zIndex: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 32,
    textAlign: 'center',
    marginTop: 100,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  icon: {
    marginRight: 8,
    color: '#007AFF',
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    zIndex: 1,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  link: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
});

export default RegisterScreen;
