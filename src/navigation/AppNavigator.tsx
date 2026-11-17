import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ActivitiesScreen from '../screens/ActivitiesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import Activity1ProfileScreen from '../screens/activities/Activity1ProfileScreen';
import Activity2CounterScreen from '../screens/activities/Activity2CounterScreen';
import Activity3NetworkMonitorScreen from '../screens/activities/Activity3NetworkMonitorScreen';
import Activity4NetworkDiagnosticScreen from '../screens/activities/Activity4NetworkDiagnosticScreen';
import Activity5MeshChatScreen from '../screens/activities/Activity5MeshChatScreen';
import GeofenceMapScreen from '../screens/activities/GeofenceMapScreen';
import { useTheme } from '../context/ThemeContext';

export type RootStackParamList = {
  Home: undefined;
  Activities: undefined;
  Profile: undefined;
  Settings: undefined;
  Activity1: undefined;
  Activity2: undefined;
  Activity3: undefined;
  Activity4: undefined;
  Activity5: undefined;
  Geofence: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.header },
        headerTintColor: theme.colors.text,
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Stack.Screen name="Activities" component={ActivitiesScreen} options={{ title: 'Activities' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      <Stack.Screen name="Activity1" component={Activity1ProfileScreen} options={{ title: 'Student Information' }} />
      <Stack.Screen name="Activity2" component={Activity2CounterScreen} options={{ title: 'Counter Module' }} />
      <Stack.Screen name="Activity3" component={Activity3NetworkMonitorScreen} options={{ title: 'Network Monitor' }} />
      <Stack.Screen name="Activity4" component={Activity4NetworkDiagnosticScreen} options={{ title: 'Network Diagnostic' }} />
      <Stack.Screen name="Activity5" component={Activity5MeshChatScreen} options={{ title: 'Local Mesh Chat' }} />
      <Stack.Screen name="Geofence" component={GeofenceMapScreen} options={{ title: 'Geofence Map' }} />
    </Stack.Navigator>
  );
}
