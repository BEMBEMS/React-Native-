import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import CustomHeader from '../../components/CustomHeader';
import CustomButton from '../../components/CustomButton';
import { useTheme } from '../../context/ThemeContext';
import { formatTime } from '../../utils/formatters';

type Msg = { id: string; text: string; mine: boolean; time: Date; sender: string };
type Peer = { id: string; name: string; status: 'discovered' | 'connecting' | 'connected' };

const mockPeers: Peer[] = [
  { id: 'p1', name: 'Nearby Phone A', status: 'discovered' },
  { id: 'p2', name: 'Nearby Phone B', status: 'discovered' },
];

export default function Activity5MeshChatScreen() {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [peers, setPeers] = useState<Peer[]>([]);
  const [connected, setConnected] = useState<Peer[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [threads, setThreads] = useState<Record<string, Msg[]>>({});
  const [draft, setDraft] = useState('');

  const startScan = () => {
    setScanning((s) => !s);
    if (!scanning) setPeers(mockPeers);
    else setPeers([]);
  };
  const connect = (p: Peer) => {
    if (connected.find((c) => c.id === p.id)) { setActive(p.id); return; }
    const cp = { ...p, status: 'connected' as const };
    setConnected((c) => [...c, cp]);
    setPeers((ps) => ps.filter((x) => x.id !== p.id));
    setThreads((t) => ({ ...t, [p.id]: t[p.id] || [{ id: 'sys', text: `Connected to ${p.name}`, mine: false, time: new Date(), sender: 'System' }] }));
    setActive(p.id);
    setScanning(false);
  };
  const disconnect = (id: string) => {
    setConnected((c) => c.filter((x) => x.id !== id));
    if (active === id) setActive(connected.find(c=>c.id!==id)?.id ?? null);
  };
  const send = () => {
    if (!active || !draft.trim()) return;
    const msg: Msg = { id: String(Date.now()), text: draft.trim(), mine: true, time: new Date(), sender: 'Me' };
    setThreads((t) => ({ ...t, [active]: [...(t[active] || []), msg] }));
    setDraft('');
    setTimeout(() => {
      setThreads((t) => ({ ...t, [active]: [...(t[active] || []), { id: String(Date.now()+1), text: 'Demo echo: message received.', mine: false, time: new Date(), sender: connected.find(c=>c.id===active)?.name || 'Peer' }] }));
    }, 700);
  };

  const messages = active ? threads[active] || [] : [];
  const activePeer = connected.find(c=>c.id===active);

  return (
    <ScreenContainer>
      <CustomHeader title="Local Mesh Chat" subtitle="Activity 5 - Offline peer-to-peer Bluetooth chat" />
      <View style={{ marginTop: 12 }}>
        <View style={[styles.banner, { backgroundColor: '#FEF3C7', borderColor: '#F59E0B55' }]}>
          <Text style={{ color: '#92400E', fontSize: 12, lineHeight: 18 }}>
            Nearby Connections (Bluetooth/Wi‑Fi Direct) requires native modules not available in the base Expo app. This screen preserves the mesh chat UI, peer management, and messaging flow as a demo; full P2P transport requires a development build with a nearby-connections library.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.section, { color: theme.colors.text }]}>Nearby Devices ({connected.length}/4 connected)</Text>
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}><CustomButton title={visible ? 'Hide Me' : 'Make Visible'} onPress={() => setVisible(v=>!v)} /></View>
            <View style={{ flex: 1 }}><CustomButton title={scanning ? 'Stop Scan' : 'Find Nearby'} onPress={startScan} /></View>
          </View>
          <Text style={{ color: theme.colors.textSecondary, marginTop: 8, fontSize: 12 }}>Visibility: {visible ? 'Advertising' : 'Off'} · Discovery: {scanning ? 'Scanning…' : 'Idle'}</Text>
          {peers.map(p => (
            <TouchableOpacity key={p.id} style={[styles.peer, { borderColor: theme.colors.border }]} onPress={() => connect(p)}>
              <Text style={{ color: theme.colors.text, fontWeight: '600' }}>{p.name}</Text>
              <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>Connect</Text>
            </TouchableOpacity>
          ))}
          {connected.length>0 && <Text style={[styles.subhead, { color: theme.colors.text }]}>Connected</Text>}
          {connected.map(c => (
            <TouchableOpacity key={c.id} style={[styles.peer, { borderColor: active===c.id? theme.colors.primary : theme.colors.border }]} onPress={()=>setActive(c.id)} onLongPress={()=>disconnect(c.id)}>
              <Text style={{ color: theme.colors.text, fontWeight: '600' }}>{c.name} {active===c.id?'(active)':''}</Text>
              <Text style={{ color: '#E53935', fontSize: 12 }}>Hold to disconnect</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, minHeight: 320 }]}>
          <Text style={[styles.section, { color: theme.colors.text }]}>{activePeer ? `Chat with ${activePeer.name}` : 'Chat'}</Text>
          {!active ? (
            <Text style={{ color: theme.colors.textSecondary }}>Connect to a device to start chatting.</Text>
          ) : (
            <>
              <FlatList
                data={messages}
                keyExtractor={(m) => m.id}
                style={{ maxHeight: 260 }}
                renderItem={({ item }) => (
                  <View style={[styles.bubble, { alignSelf: item.mine ? 'flex-end' : 'flex-start', backgroundColor: item.mine ? theme.colors.primary : theme.colors.background, borderColor: theme.colors.border }]}>
                    {!item.mine && <Text style={{ fontSize: 11, color: theme.colors.textSecondary, marginBottom: 2 }}>{item.sender}</Text>}
                    <Text style={{ color: item.mine ? '#fff' : theme.colors.text }}>{item.text}</Text>
                    <Text style={{ fontSize: 10, color: item.mine ? '#E0E7FF' : theme.colors.textSecondary, marginTop: 2, textAlign: 'right' }}>{formatTime(item.time)}</Text>
                  </View>
                )}
              />
              <View style={styles.inputRow}>
                <TextInput value={draft} onChangeText={setDraft} placeholder="Message…" placeholderTextColor={theme.colors.textSecondary}
                  style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border, backgroundColor: theme.colors.background }]} />
                <TouchableOpacity onPress={send} style={[styles.send, { backgroundColor: theme.colors.primary }]}>
                  <Text style={{ color: '#fff', fontWeight: '700' }}>Send</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  banner: { padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  card: { borderWidth: 1, borderRadius: 16, padding: 14, marginBottom: 12 },
  section: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  subhead: { fontSize: 14, fontWeight: '600', marginTop: 10, marginBottom: 4 },
  row: { flexDirection: 'row' },
  peer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderWidth: 1, borderRadius: 10, marginTop: 8 },
  bubble: { padding: 10, borderRadius: 12, borderWidth: 1, marginVertical: 4, maxWidth: '85%' },
  inputRow: { flexDirection: 'row', marginTop: 8, alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginRight: 8 },
  send: { paddingHorizontal: 14, paddingVertical: 12, borderRadius: 10 },
});
