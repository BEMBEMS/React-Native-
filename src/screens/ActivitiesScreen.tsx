import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../components/ScreenContainer';
import CustomHeader from '../components/CustomHeader';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Activities'>;

const activities = [
  { key: 'Activity1' as const, id: 'Activity 1', title: 'Student Information' },
  { key: 'Activity2' as const, id: 'Activity 2', title: 'Counter Module' },
  { key: 'Activity3' as const, id: 'Activity 3', title: 'Network Monitor' },
  { key: 'Activity4' as const, id: 'Activity 4', title: 'Network Diagnostic' },
  { key: 'Activity5' as const, id: 'Activity 5', title: 'Local Mesh Chat' },
  { key: 'Geofence' as const, id: 'Midterm', title: 'Geofence Map' },
];

export default function ActivitiesScreen({ navigation }: Props) {
  const { theme } = useTheme();
  return (
    <ScreenContainer>
      <CustomHeader title="Laboratory Activities" />
      {activities.map((a) => (
        <TouchableOpacity
          key={a.key}
          activeOpacity={0.8}
          onPress={() => navigation.navigate(a.key)}
          style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
        >
          <Text style={[styles.id, { color: theme.colors.primary }]}>{a.id}</Text>
          <Text style={[styles.title, { color: theme.colors.text }]}>{a.title}</Text>
        </TouchableOpacity>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  id: { fontWeight: '700', fontSize: 13, marginBottom: 4 },
  title: { fontSize: 16, fontWeight: '600' },
});
