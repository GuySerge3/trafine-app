import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

// Écrans
import HomeScreen from "../screens/HomeScreen"; 
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import TripSummaryScreen from "../screens/TripSummaryScreen";
import NavigationScreen from "../screens/NavigationScreen";
import IncidentScreen from "../screens/IncidentReportScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import UserIncidentsScreen from "../screens/UserIncidentsScreen";

// Auth
import { AuthContext } from "../context/AuthContext";

// ✅ Mode développeur
const DEBUG_MODE = true;

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { userToken: realToken } = useContext(AuthContext);
  const userToken = DEBUG_MODE ? true : realToken;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userToken ? (
          <>
            {/* ✅ Page d'accueil en mode connecté */}
            <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
            <Stack.Screen name="Incident" component={IncidentScreen} />
            <Stack.Screen name="UserIncidents" component={UserIncidentsScreen} />
            <Stack.Screen name="TripSummary" component={TripSummaryScreen} />
            <Stack.Screen name="Navigation" component={NavigationScreen} />
          </>
        ) : (
          <>
            {/* ✅ Page d'accueil en mode non connecté */}
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
