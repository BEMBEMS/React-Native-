import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { distanceInMeters } from '../utils/geofence';
import type { GeofenceMapViewProps } from './GeofenceMapView.types';

export default function GeofenceMapView({ landmarks, userLocation, radiusColor, markerColor }: GeofenceMapViewProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Map preview is unavailable in the browser</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        The interactive OpenStreetMap layer uses react-native-maps, which only runs on iOS and Android. Geofence status and events below still work.
      </Text>
      <View style={styles.row}>
        <View style={[styles.dot, { backgroundColor: markerColor }]} />
        <Text style={[styles.rowText, { color: theme.colors.text }]}>
          Selected: {userLocation.latitude.toFixed(5)}, {userLocation.longitude.toFixed(5)}
        </Text>
      </View>
      <ScrollView style={styles.list}>
        {landmarks.length === 0 ? (
          <Text style={[styles.rowText, { color: theme.colors.textSecondary }]}>No geofences added yet.</Text>
        ) : (
          landmarks.map((l) => (
            <View key={l.id} style={styles.row}>
              <View style={[styles.dot, { backgroundColor: l.color }]} />
              <Text style={[styles.rowText, { color: theme.colors.text }]}>
                {l.name} - {Math.round(distanceInMeters(userLocation, l.position))} m away ({l.radiusMeters} m radius)
              </Text>
            </View>
          ))
        )}
      </ScrollView>
      <View style={styles.row}>
        <View style={[styles.dot, { backgroundColor: radiusColor }]} />
        <Text style={[styles.rowText, { color: theme.colors.textSecondary }]}>Selected-radius visualization</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, gap: 6 },
  title: { fontSize: 15, fontWeight: '700' },
  subtitle: { fontSize: 12, lineHeight: 17, marginBottom: 4 },
  list: { flexGrow: 0, maxHeight: 120 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 2 },
  rowText: { fontSize: 12, flexShrink: 1 },
  dot: { width: 10, height: 10, borderRadius: 5 },
});
