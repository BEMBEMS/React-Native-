import type { GeofenceLocation, LatLng } from '../utils/geofence';

export type GeofenceMapRegion = LatLng & {
  latitudeDelta: number;
  longitudeDelta: number;
};

export type GeofenceMapViewProps = {
  initialRegion: GeofenceMapRegion;
  landmarks: GeofenceLocation[];
  userLocation: LatLng;
  radiusColor: string;
  markerColor: string;
  onPressCoordinate: (coordinate: LatLng) => void;
  onMarkerPress: (landmark: GeofenceLocation) => void;
};
