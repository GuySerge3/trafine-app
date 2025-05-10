import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';

import MapScreen from '../screens/MapScreen';
import SettingsScreen from '../screens/SettingsScreen';
import IncidentReportScreen from '../screens/IncidentReportScreen';
import AlertScreen from '../screens/AlertScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName = '';
          if (route.name === 'Carte') iconName = 'map';
          else if (route.name === 'Paramètres') iconName = 'settings';
          else if (route.name === 'Signaler') iconName = 'alert-triangle';
          else if (route.name === 'Notifications') iconName = 'bell';

          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarLabel: route.name, // ✅ renvoie une string au lieu de <Text>
        tabBarLabelStyle: { fontSize: 12 }, // ✅ style de texte ici
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Carte" component={MapScreen} />
      <Tab.Screen name="Signaler" component={IncidentReportScreen} />
      <Tab.Screen name="Notifications" component={AlertScreen} />
      <Tab.Screen name="Paramètres" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
