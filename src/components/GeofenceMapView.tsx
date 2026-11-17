import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Circle, Marker, UrlTile, Region, MapPressEvent } from 'react-native-maps';
import type { GeofenceMapViewProps } from './GeofenceMapView.types';

export default function GeofenceMapView({
  initialRegion,
  landmarks,
  userLocation,
  radiusColor,
  markerColor,
  onPressCoordinate,
  onMarkerPress,
}: GeofenceMapViewProps) {
  return (
    <MapView
      style={styles.map}
      initialRegion={initialRegion as Region}
      scrollEnabled
      zoomEnabled
      rotateEnabled
      pitchEnabled
      onPress={(e: MapPressEvent) => onPressCoordinate(e.nativeEvent.coordinate)}
    >
      <UrlTile
        urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        maximumZ={19}
        flipY={false}
        zIndex={-1}
      />
      {landmarks.map((l) => (
        <Circle
          key={`c-${l.id}`}
          center={{ latitude: l.position.latitude, longitude: l.position.longitude }}
          radius={l.radiusMeters}
          strokeColor={l.color}
          fillColor={`${l.color}33`}
          strokeWidth={2}
        />
      ))}
      {landmarks.map((l) => (
        <Marker
          key={l.id}
          coordinate={{ latitude: l.position.latitude, longitude: l.position.longitude }}
          title={l.name}
          description={l.category}
          pinColor={l.color}
          onPress={() => onMarkerPress(l)}
        />
      ))}
      <Circle
        center={{ latitude: userLocation.latitude, longitude: userLocation.longitude }}
        radius={60}
        strokeColor={radiusColor}
        fillColor={`${radiusColor}33`}
        strokeWidth={2}
      />
      <Marker
        coordinate={{ latitude: userLocation.latitude, longitude: userLocation.longitude }}
        title="Selected location"
        description="Tap anywhere on the map to move this marker"
        pinColor={markerColor}
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
});
