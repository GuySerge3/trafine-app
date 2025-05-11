import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, View } from "react-native";

// Écrans publics
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

// Écrans privés (utilisateur connecté)
import BottomTabNavigator from "./BottomTabNavigator";
import IncidentScreen from "../screens/IncidentReportScreen";
import UserIncidentsScreen from "../screens/UserIncidentsScreen";
import TripSummaryScreen from "../screens/TripSummaryScreen";
import NavigationScreen from "../screens/NavigationScreen";

// Auth context
import { AuthContext } from "../context/AuthContext";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { userToken, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!userToken ? (
          // 🟡 Utilisateur non connecté
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          // 🟢 Utilisateur connecté
          <>
            <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
            <Stack.Screen name="Incident" component={IncidentScreen} />
            <Stack.Screen name="UserIncidents" component={UserIncidentsScreen} />
            <Stack.Screen name="TripSummary" component={TripSummaryScreen} />
            <Stack.Screen name="Navigation" component={NavigationScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
