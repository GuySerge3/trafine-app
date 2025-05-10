import React, { useEffect, useRef } from "react";
import { View, Text, Animated, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import styles from "../styles/HomeScreen.styles";

const HomeScreen = ({ navigation }) => {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseIconAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animation d’entrée
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Ensuite, pulsation continue de l'icône
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseIconAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseIconAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    // Animation boucle du bouton
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* 🌍 Animation planète en fond */}
      <LottieView
        source={require("../assets/lottie/earth.json")}
        autoPlay
        loop
        style={styles.earth}
      />

      {/* Icône login en haut à droite */}
      <TouchableOpacity
        style={styles.loginIcon}
        onPress={() => navigation.navigate("Login")}
      >
        <MaterialIcons name="login" size={28} color="#007AFF" />
      </TouchableOpacity>

      {/* Icône animée principale : entrée + pulsation */}
      <Animated.View
        style={{
          transform: [
            { scale: scaleAnim },
            { scale: pulseIconAnim }
          ],
          opacity: opacityAnim,
        }}
      >
        <MaterialIcons name="location-on" size={120} color="#007AFF" />
      </Animated.View>

      <Text style={styles.title}>EXPLOREZ AVEC SUPMAP</Text>
      <Text style={styles.subtitle}>
        Découvrez, naviguez, et explorez le monde avec notre app de cartographie
        intuitive.
      </Text>

      {/* ✅ Bouton animé (pulsation) */}
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <TouchableOpacity
          style={styles.customButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.customButtonText}>Commencer</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default HomeScreen;
