export type LatLng = { latitude: number; longitude: number };

export const maxGeofenceLocations = 5;

export type GeofenceLocation = {
  id: string;
  name: string;
  address: string;
  category: string;
  description: string;
  position: LatLng;
  radiusMeters: number;
  color: string;
  isPinned?: boolean;
  imageUri?: string | null;
};

export const DelMonteMapConfig = {
  center: { latitude: 8.4896545, longitude: 125.8431692 },
  defaultUserLocation: { latitude: 8.4894, longitude: 125.8431 },
  defaultZoom: 15.8,
};

export const defaultGeofenceLandmarks: GeofenceLocation[] = [
  {
    id: 'ciloys_home',
    name: "Ciloy's Home",
    address: 'Bah-bah - Talacogon Road, Purok 5, Del Monte, Talacogon',
    category: 'Home',
    description:
      "Ciloy's family home on the right side of Bah-bah - Talacogon Road, north-east of Purok 5.",
    position: { latitude: 8.49275, longitude: 125.844 },
    radiusMeters: 60,
    color: '#E67E22',
  },
  {
    id: 'ivys_home',
    name: "Ivy's Home",
    address: 'Bah-bah - Talacogon Road, Purok 5, Del Monte, Talacogon',
    category: 'Home',
    description:
      "Ivy's family home on the left side of Bah-bah - Talacogon Road, north-west of Purok 5.",
    position: { latitude: 8.49275, longitude: 125.8431 },
    radiusMeters: 60,
    color: '#8E24AA',
  },
  {
    id: 'tindahans_mga_chuy',
    name: 'Tindahans mga Chuy',
    address: 'Pisaan-Del Monte Road, Purok 5, Del Monte, Talacogon',
    category: 'Store',
    description:
      'A neighborhood store on Pisaan-Del Monte Road near the Bah-bah - Talacogon Road junction. Pinned by default.',
    position: { latitude: 8.49015, longitude: 125.84213 },
    radiusMeters: 60,
    color: '#43A047',
    isPinned: true,
  },
  {
    id: 'kalye58_tamabayanan',
    name: 'Kalye58 Tamabayanan',
    address: 'Pisaan-Del Monte Road (CENRO), Purok 5, Del Monte, Talacogon',
    category: 'Tambayanan',
    description:
      'A tambayanan on Pisaan-Del Monte Road, right at the Community Environment and Natural Resources Office (CENRO).',
    position: { latitude: 8.4892661, longitude: 125.8437722 },
    radiusMeters: 40,
    color: '#F9A825',
  },
  {
    id: 'malihao_spot',
    name: 'Malihao Spot',
    address: 'Malihao Road, Purok 8, Del Monte, Talacogon',
    category: 'Water Spot',
    description:
      'A water spot south of Purok 8 along the road extending from Pisaan-Del Monte Road.',
    position: { latitude: 8.4868, longitude: 125.84766 },
    radiusMeters: 60,
    color: '#0277BD',
  },
];

const toRad = (v: number) => (v * Math.PI) / 180;
export function distanceInMeters(from: LatLng, to: LatLng): number {
  const R = 6371000;
  const dLat = toRad(to.latitude - from.latitude);
  const dLon = toRad(to.longitude - from.longitude);
  const lat1 = toRad(from.latitude);
  const lat2 = toRad(to.latitude);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
