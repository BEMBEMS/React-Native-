import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import CustomHeader from '../../components/CustomHeader';
import { useTheme } from '../../context/ThemeContext';

type Status = 'checking' | 'online' | 'offline';

export default function Activity3NetworkMonitorScreen() {
  const { theme } = useTheme();
  const [status, setStatus] = useState<Status>('checking');
  const [pingMs, setPingMs] = useState<number | null>(null);
  const [pingError, setPingError] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const prev = useRef<Status>('checking');

  const ping = async () => {
    const start = Date.now();
    try {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 5000);
      await fetch('https://jsonplaceholder.typicode.com/todos/1', { method: 'HEAD', signal: controller.signal });
      clearTimeout(t);
      const ms = Date.now() - start;
      setPingMs(ms);
      setPingError(false);
      setStatus('online');
    } catch {
      setPingError(true);
      setStatus('offline');
    }
  };

  useEffect(() => {
    const initial = setTimeout(() => { void ping(); }, 0);
    const id = setInterval(() => { void ping(); }, 5000);
    return () => {
      clearTimeout(initial);
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    if (prev.current === 'checking') {
      prev.current = status;
      return;
    }
    if (prev.current !== status) {
      setToast(status === 'online' ? 'Connection restored' : 'Connection lost - Offline');
      const t = setTimeout(() => setToast(null), 4000);
      prev.current = status;
      return () => clearTimeout(t);
    }
  }, [status]);

  const color = status === 'online' ? '#4CAF50' : status === 'offline' ? '#E53935' : '#9E9E9E';
  const label = status === 'checking' ? 'Checking connection…' : status === 'online' ? 'Internet Connected' : 'No Internet Connection';
  const badge = status === 'checking' ? 'CHECKING' : status === 'online' ? 'CONNECTED' : 'NO INTERNET';
  const pingLabel = pingError ? 'Response Time: Unavailable' : pingMs == null ? 'Response Time: Measuring…' : `Response Time: ${pingMs} ms`;

  return (
    <ScreenContainer scroll={false}>
      <CustomHeader title="Network Monitor" subtitle="Activity 3 - Real-time connection status" />
      {toast && (
        <View style={[styles.toast, { backgroundColor: theme.colors.card, borderColor: color }]}>
          <Text style={{ color: theme.colors.text, fontWeight: '500' }}>{toast}</Text>
        </View>
      )}
      <View style={styles.body}>
        <View style={[styles.statusCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <View style={[styles.iconCircle, { backgroundColor: `${color}33`, borderColor: color }]}>
            <Text style={{ fontSize: 28 }}>{status === 'online' ? '📶' : status === 'offline' ? '⚠️' : '…'}</Text>
          </View>
          <Text style={[styles.statusLabel, { color: theme.colors.text }]}>{label}</Text>
          <View style={[styles.badge, { backgroundColor: `${color}33` }]}>
            <Text style={[styles.badgeText, { color }]}>{badge}</Text>
          </View>
          <Text style={[styles.ping, { color: theme.colors.textSecondary }]}>{pingLabel}</Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, padding: 16, justifyContent: 'center' },
  statusCard: { borderWidth: 1, borderRadius: 24, padding: 32, alignItems: 'center' },
  iconCircle: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  statusLabel: { fontSize: 22, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  badge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginBottom: 12 },
  badgeText: { fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  ping: { fontSize: 14 },
  toast: { marginHorizontal: 16, marginTop: 8, padding: 12, borderRadius: 12, borderWidth: 1 },
});
