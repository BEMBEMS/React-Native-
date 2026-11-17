import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Modal, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import ScreenContainer from '../../components/ScreenContainer';
import GeofenceMapView from '../../components/GeofenceMapView';
import CustomHeader from '../../components/CustomHeader';
import { useTheme } from '../../context/ThemeContext';
import { DelMonteMapConfig, distanceInMeters, GeofenceLocation, LatLng, maxGeofenceLocations } from '../../utils/geofence';

const STORAGE_KEY = 'geofence_locations_v1';

type GeofenceEvent = { id: string; landmark: GeofenceLocation; entered: boolean; time: Date };

export default function GeofenceMapScreen() {
  const { theme } = useTheme();
  const [landmarks, setLandmarks] = useState<GeofenceLocation[]>([]);
  const [userLocation, setUserLocation] = useState<LatLng>(DelMonteMapConfig.defaultUserLocation);
  const radiusColor = '#2196F3';
  const markerColor = '#2196F3';
  const [insideIds, setInsideIds] = useState<Set<string>>(new Set());
  const [events, setEvents] = useState<GeofenceEvent[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState<{ open: boolean; editing?: GeofenceLocation; draft: Partial<GeofenceLocation> }>({ open: false, draft: {} });
  const [walking, setWalking] = useState(false);
  const walkRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const walkIdx = useRef(0);
  const prevInside = useRef<Set<string>>(new Set());
  const initialRegion = {
    latitude: DelMonteMapConfig.center.latitude,
    longitude: DelMonteMapConfig.center.longitude,
    latitudeDelta: 0.012,
    longitudeDelta: 0.012,
  };

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.removeItem(STORAGE_KEY);
      } catch {}
      setLoaded(true);
    })();
  }, []);
  useEffect(() => { if (loaded) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(landmarks)).catch(()=>{}); }, [landmarks, loaded]);

  useEffect(() => {
    const inside = new Set<string>();
    landmarks.forEach((l) => { if (distanceInMeters(userLocation, l.position) <= l.radiusMeters) inside.add(l.id); });
    const prev = prevInside.current;
    const newEvents: GeofenceEvent[] = [];
    inside.forEach(id => { if (!prev.has(id)) { const l = landmarks.find(x=>x.id===id)!; newEvents.push({ id: `${Date.now()}-${id}-in`, landmark: l, entered: true, time: new Date() }); } });
    prev.forEach(id => { if (!inside.has(id)) { const l = landmarks.find(x=>x.id===id); if(l) newEvents.push({ id: `${Date.now()}-${id}-out`, landmark: l, entered: false, time: new Date() }); } });
    if (newEvents.length) setEvents(e => [...newEvents, ...e].slice(0, 20));
    prevInside.current = inside;
    setInsideIds(inside);
  }, [userLocation, landmarks]);

  const insideList = landmarks.filter(l=>insideIds.has(l.id));
  const nearest = useMemo(() => {
    if (!landmarks.length) return null as null | { l: GeofenceLocation; d: number };
    return landmarks.map(l=>({ l, d: distanceInMeters(userLocation, l.position) })).sort((a,b)=>a.d-b.d)[0];
  }, [landmarks, userLocation]);

  const setUser = (pos: LatLng) => setUserLocation(pos);

  const toggleWalk = () => {
    if (walking) {
      if (walkRef.current) clearInterval(walkRef.current);
      walkRef.current = null; setWalking(false); return;
    }
    if (!landmarks.length) return;
    setWalking(true); walkIdx.current = 0;
    walkRef.current = setInterval(() => {
      const t = landmarks[walkIdx.current % landmarks.length];
      setUser({ latitude: t.position.latitude + (Math.random()-0.5)*0.0004, longitude: t.position.longitude + (Math.random()-0.5)*0.0004 });
      walkIdx.current++;
    }, 2000);
  };
  useEffect(()=>() => { if (walkRef.current) clearInterval(walkRef.current); }, []);

  const openAdd = (pos?: LatLng) => {
    if (landmarks.length >= maxGeofenceLocations) { Alert.alert('Limit reached', `You can have up to ${maxGeofenceLocations} locations. Replace one to add new.`); return; }
    setForm({ open: true, draft: { position: pos || userLocation, radiusMeters: 60, color: '#E67E22', category: 'Custom' } });
  };
  const openEdit = (l: GeofenceLocation) => setForm({ open: true, editing: l, draft: { ...l, position: l.position } });

  const saveForm = () => {
    const d = form.draft;
    if (!d.name?.trim()) { Alert.alert('Required', 'Location name is required.'); return; }
    if (!form.editing && !d.imageUri) { Alert.alert('Required', 'Upload a location image to continue.'); return; }
    const loc: GeofenceLocation = {
      id: form.editing?.id || `location_${Date.now()}`,
      name: d.name!.trim(),
      address: (d.address || d.name || '').trim(),
      category: (d.category || 'Custom').trim(),
      description: (d.description || '').trim(),
      position: d.position || userLocation,
      radiusMeters: Math.max(20, Math.min(300, Number(d.radiusMeters) || 60)),
      color: d.color || '#E67E22',
      isPinned: true,
      imageUri: d.imageUri ?? form.editing?.imageUri ?? null,
    };
    setLandmarks(prev => {
      let next = form.editing ? prev.map(p => p.id === loc.id ? loc : { ...p, isPinned: false }) : [...prev.map(p=>({ ...p, isPinned: false })), loc];
      return next;
    });
    setForm({ open: false, draft: {} });
  };
  const removeLoc = (id: string) => {
    setLandmarks(prev => {
      const next = prev.filter(p=>p.id!==id);
      if (next.length && !next.some(n=>n.isPinned)) next[0] = { ...next[0], isPinned: true };
      return [...next];
    });
  };
  const replaceFlow = () => {
    Alert.alert(
      'Replace location',
      'Choose a location to replace',
      [
        ...landmarks.map((l) => ({
          text: l.name,
          onPress: () =>
            setForm({
              open: true,
              editing: l,
              draft: {
                position: userLocation,
                radiusMeters: 60,
                color: '#E67E22',
                category: 'Custom',
                name: '',
                address: '',
                description: '',
              },
            }),
        })),
        { text: 'Cancel', style: 'cancel' as const },
      ],
    );
  };

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!res.canceled && res.assets[0]) setForm(f=>({ ...f, draft: { ...f.draft, imageUri: res.assets[0].uri } }));
  };

  return (
    <ScreenContainer>
      <CustomHeader title="Geofence Map" subtitle="Midterm Requirement - Real OSM area with geofences" />
      <View style={{ marginTop: 12 }}>
        <View style={[styles.statusCard, { backgroundColor: theme.colors.card, borderColor: insideList.length ? '#43A047' : theme.colors.border }]}>
          <Text style={[styles.statusTitle, { color: theme.colors.text }]}>Geofence Status</Text>
          <Text style={{ color: insideList.length ? '#43A047' : theme.colors.textSecondary, fontWeight: '600', marginTop: 2 }}>
            {insideList.length ? `Inside ${insideList.map(i=>i.name).join(', ')}` : landmarks.length ? 'Outside all geofences' : 'No locations configured'}
          </Text>
          <Text style={{ color: theme.colors.textSecondary, marginTop: 6, fontSize: 12 }}>Lat {userLocation.latitude.toFixed(5)}, Lng {userLocation.longitude.toFixed(5)}</Text>
          {nearest && <Text style={{ color: theme.colors.textSecondary, fontSize: 12, marginTop: 2 }}>Nearest: {nearest.l.name} ({Math.round(nearest.d)} m)</Text>}
          {landmarks.find(l=>l.isPinned) && <Text style={{ color: theme.colors.textSecondary, fontSize: 12, marginTop: 2 }}>Last pinned: {landmarks.find(l=>l.isPinned)!.address}</Text>}
        </View>

        <View style={[styles.mapContainer, { borderColor: theme.colors.border }]}>
          <GeofenceMapView
            initialRegion={initialRegion}
            landmarks={landmarks}
            userLocation={userLocation}
            radiusColor={radiusColor}
            markerColor={markerColor}
            onPressCoordinate={(coordinate) => setUserLocation(coordinate)}
            onMarkerPress={(l) => openEdit(l)}
          />
        </View>
        <View style={styles.actionsRow}>
          <Action label={walking ? 'Stop Walk' : 'Simulate Walk'} onPress={toggleWalk} theme={theme} filled={walking} />
          <Action label="Move Here" onPress={() => setUser(DelMonteMapConfig.center)} theme={theme} />
        </View>
        <View style={styles.actionsRow}>
          <Action label="Add Location" onPress={() => landmarks.length >= maxGeofenceLocations ? replaceFlow() : openAdd()} theme={theme} />
          <Action label="Drop Pin Here" onPress={() => landmarks.length >= maxGeofenceLocations ? replaceFlow() : openAdd(userLocation)} theme={theme} />
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[styles.section, { color: theme.colors.text }]}>Geofence Events</Text>
            {events.length>0 && <TouchableOpacity onPress={()=>setEvents([])}><Text style={{ color: theme.colors.textSecondary }}>Clear</Text></TouchableOpacity>}
          </View>
          {events.length===0 ? <Text style={{ color: theme.colors.textSecondary }}>No events yet. Move/simulate to trigger geofences.</Text> :
            events.slice(0,6).map(e => (
              <View key={e.id} style={styles.eventRow}>
                <Text style={{ color: e.entered ? '#43A047' : '#E53935', fontWeight: '700', width: 60 }}>{e.entered ? 'ENTER' : 'EXIT'}</Text>
                <View style={{ flex: 1 }}><Text style={{ color: theme.colors.text, fontWeight: '600' }}>{e.landmark.name}</Text><Text style={{ color: theme.colors.textSecondary, fontSize: 11 }}>{e.landmark.category} • {e.time.toLocaleTimeString()}</Text></View>
              </View>
            ))}
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={[styles.section, { color: theme.colors.text }]}>My Locations</Text>
            <Text style={{ color: theme.colors.textSecondary }}>{landmarks.length} / {maxGeofenceLocations}</Text>
          </View>
          {landmarks.length===0 ? <Text style={{ color: theme.colors.textSecondary }}>No locations yet. Add one to start geofencing.</Text> :
            landmarks.map(l => {
              const inside = insideIds.has(l.id); const d = Math.round(distanceInMeters(userLocation, l.position));
              return (
                <View key={l.id} style={[styles.locRow, { borderColor: inside ? l.color : theme.colors.border }]}>
                  <View style={[styles.locIcon, { backgroundColor: l.color }]}>{l.imageUri ? <Image source={{ uri: l.imageUri }} style={{ width: 40, height: 40, borderRadius: 10 }} /> : <Text style={{ color:'#fff', fontWeight:'700' }}>{l.name[0]}</Text>}</View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={{ color: theme.colors.text, fontWeight: '600' }}>{l.name} {l.isPinned ? '📌' : ''} {inside ? '• INSIDE' : ''}</Text>
                    <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>{l.category} • {l.radiusMeters} m radius • {d} m away</Text>
                    <Text style={{ color: theme.colors.textSecondary, fontSize: 11 }} numberOfLines={1}>{l.address}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 4 }}>
                    <TouchableOpacity onPress={()=>openEdit(l)}><Text style={{ color: theme.colors.primary, fontWeight: '600' }}>Edit</Text></TouchableOpacity>
                    <TouchableOpacity onPress={()=>removeLoc(l.id)}><Text style={{ color: '#E53935' }}>Remove</Text></TouchableOpacity>
                  </View>
                </View>
              );
            })}
        </View>
      </View>

      <Modal visible={form.open} transparent animationType="slide" onRequestClose={()=>setForm({ open:false, draft:{} })}>
        <View style={styles.modalWrap}>
          <ScrollView style={[styles.modal, { backgroundColor: theme.colors.card }]} contentContainerStyle={{ padding: 16 }}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>{form.editing ? 'Edit Location' : 'New Location'}</Text>
            <Field label="Location name" value={form.draft.name||''} onChange={(v: string)=>setForm(f=>({ ...f, draft:{...f.draft, name:v} }))} theme={theme} />
            <Field label="Address" value={form.draft.address||''} onChange={(v: string)=>setForm(f=>({ ...f, draft:{...f.draft, address:v} }))} theme={theme} />
            <Field label="Category" value={form.draft.category||'Custom'} onChange={(v: string)=>setForm(f=>({ ...f, draft:{...f.draft, category:v} }))} theme={theme} />
            <Field label="Description" value={form.draft.description||''} onChange={(v: string)=>setForm(f=>({ ...f, draft:{...f.draft, description:v} }))} theme={theme} multiline />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View style={{ flex:1 }}><Field label="Latitude" value={String(form.draft.position?.latitude ?? '')} onChange={(v: string)=>setForm(f=>({ ...f, draft:{...f.draft, position:{ latitude: parseFloat(v)||0, longitude: f.draft.position?.longitude ?? 0 }} }))} theme={theme} /></View>
              <View style={{ flex:1 }}><Field label="Longitude" value={String(form.draft.position?.longitude ?? '')} onChange={(v: string)=>setForm(f=>({ ...f, draft:{...f.draft, position:{ latitude: f.draft.position?.latitude ?? 0, longitude: parseFloat(v)||0 }} }))} theme={theme} /></View>
            </View>
            <Field label="Geofence radius (20-300 m)" value={String(form.draft.radiusMeters ?? 60)} onChange={(v: string)=>setForm(f=>({ ...f, draft:{...f.draft, radiusMeters: Number(v)||60} }))} theme={theme} />
            <Text style={{ color: theme.colors.text, fontWeight: '600', marginTop: 8 }}>Location image {!form.editing && '(required)'}</Text>
            {form.draft.imageUri ? <Image source={{ uri: form.draft.imageUri }} style={{ width:'100%', height:160, borderRadius:12, marginTop:8 }} /> : <View style={{ height:120, borderRadius:12, backgroundColor: theme.colors.background, alignItems:'center', justifyContent:'center', marginTop:8 }}><Text style={{ color: theme.colors.textSecondary }}>No image selected</Text></View>}
            <TouchableOpacity onPress={pickImage} style={[styles.pickBtn, { borderColor: theme.colors.primary }]}><Text style={{ color: theme.colors.primary, fontWeight: '600' }}>{form.draft.imageUri ? 'Change image' : 'Choose from gallery'}</Text></TouchableOpacity>
            <View style={{ flexDirection:'row', gap:8, marginTop: 16 }}>
              <View style={{ flex:1 }}><Action label="Cancel" onPress={()=>setForm({ open:false, draft:{} })} theme={theme} /></View>
              <View style={{ flex:1 }}><Action label={form.editing ? 'Save Changes' : 'Add Location'} onPress={saveForm} theme={theme} filled /></View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

function Field({ label, value, onChange, theme, multiline }: any) {
  return (
    <View style={{ marginTop: 10 }}>
      <Text style={{ color: theme.colors.textSecondary, fontSize: 12, marginBottom: 4 }}>{label}</Text>
      <TextInput value={value} onChangeText={onChange} multiline={multiline}
        style={{ borderWidth: 1, borderColor: theme.colors.border, borderRadius: 10, padding: 10, color: theme.colors.text, backgroundColor: theme.colors.background, minHeight: multiline?70:undefined }} />
    </View>
  );
}
function Action({ label, onPress, theme, filled }: any) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.action, { backgroundColor: filled ? `${theme.colors.primary}22` : theme.colors.card, borderColor: filled ? theme.colors.primary : theme.colors.border }]}>
      <Text style={{ color: filled ? theme.colors.primary : theme.colors.text, fontWeight: '700', fontSize: 13 }}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  statusCard: { borderWidth: 1, borderRadius: 16, padding: 14, marginBottom: 12 },
  statusTitle: { fontSize: 16, fontWeight: '700' },
  mapContainer: { height: 340, borderWidth: 1, borderRadius: 16, overflow: 'hidden', marginBottom: 10 },
  actionsRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  action: { flex: 1, borderWidth: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  card: { borderWidth: 1, borderRadius: 16, padding: 14, marginBottom: 12 },
  section: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  subLabel: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
  swatchRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  swatch: { width: 34, height: 34, borderRadius: 17, borderWidth: 2, borderColor: 'transparent' },
  eventRow: { flexDirection: 'row', paddingVertical: 6, alignItems: 'center' },
  locRow: { flexDirection: 'row', borderWidth: 1, borderRadius: 12, padding: 10, marginTop: 8, alignItems: 'center' },
  locIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  modalWrap: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modal: { maxHeight: '92%', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  pickBtn: { marginTop: 10, borderWidth: 1, borderRadius: 10, padding: 12, alignItems: 'center' },
});
