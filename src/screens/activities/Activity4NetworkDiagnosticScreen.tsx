import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import CustomHeader from '../../components/CustomHeader';
import CustomButton from '../../components/CustomButton';
import { useTheme } from '../../context/ThemeContext';
import { classifyNetworkHealth, NetworkDiagnosticResult, NetworkHealthTier } from '../../utils/networkDiagnostic';

type Stage = 'idle' | 'idlePing' | 'download' | 'upload' | 'done' | 'failed';

export default function Activity4NetworkDiagnosticScreen() {
  const { theme } = useTheme();
  const [stage, setStage] = useState<Stage>('idle');
  const [result, setResult] = useState<NetworkDiagnosticResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runTest = useCallback(async () => {
    if (stage === 'idlePing' || stage === 'download' || stage === 'upload') return;
    setError(null);
    setResult(null);
    try {
      setStage('idlePing');
      const idlePingMs = await measureIdlePing();
      setStage('download');
      const dl = await measureDownload();
      setStage('upload');
      const ul = await measureUpload();
      const totalAttempts = 3 + dl.attempts + ul.attempts;
      const totalFailures = (idlePingMs.failures ?? 0) + dl.failures + ul.failures;
      const res: NetworkDiagnosticResult = {
        idlePingMs: idlePingMs.value,
        downloadSpeedMbps: dl.mbps,
        uploadSpeedMbps: ul.mbps,
        downloadPingMs: dl.pingMs,
        uploadPingMs: ul.pingMs,
        packetLossPercent: totalAttempts ? (totalFailures / totalAttempts) * 100 : 0,
        timestamp: Date.now(),
      };
      setResult(res);
      setStage('done');
    } catch (e: any) {
      setError(e?.message || 'Diagnostic failed');
      setStage('failed');
    }
  }, [stage]);

  const runTestRef = useRef(runTest);
  useEffect(() => {
    runTestRef.current = runTest;
  }, [runTest]);

  useEffect(() => {
    const initial = setTimeout(() => { void runTestRef.current(); }, 0);
    return () => clearTimeout(initial);
  }, []);

  const tier = useMemo(() => (result ? classifyNetworkHealth(result) : NetworkHealthTier.Fair), [result]);
  const tierColor = tier === NetworkHealthTier.Excellent ? '#4CAF50' : tier === NetworkHealthTier.Fair ? '#FFB74D' : tier === NetworkHealthTier.Poor ? '#EF6C00' : '#E53935';
  const running = stage === 'idlePing' || stage === 'download' || stage === 'upload';
  const title = running ? 'Testing Network' : stage === 'failed' ? 'Test Failed' : stage === 'idle' ? 'Ready' : `Network ${tier}`;
  const subtitle = running
    ? stage === 'idlePing' ? 'Step 1/3 · Measuring idle ping…' : stage === 'download' ? 'Step 2/3 · Download speed + live ping…' : 'Step 3/3 · Upload speed + live ping…'
    : stage === 'failed' ? (error || 'Could not complete the diagnostic') : result ? `${result.downloadSpeedMbps.toFixed(1)} Mbps down · ${result.uploadSpeedMbps.toFixed(1)} Mbps up` : 'Run a test to measure your connection';

  return (
    <ScreenContainer>
      <CustomHeader title="Network Diagnostic" subtitle="Activity 4 - Ping & speed test with health tier" />
      <View style={{ marginTop: 16 }}>
        <View style={[styles.hero, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <View style={[styles.circle, { borderColor: running ? theme.colors.primary : tierColor }]}>
            {running ? <ActivityIndicator color={theme.colors.primary} /> : <Text style={{ fontSize: 28 }}>{stage === 'failed' ? '☁️' : '📈'}</Text>}
          </View>
          <Text style={[styles.heroTitle, { color: theme.colors.text }]}>{title}</Text>
          <Text style={[styles.heroSub, { color: theme.colors.textSecondary }]}>{subtitle}</Text>
        </View>

        {result && (
          <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.section, { color: theme.colors.text }]}>Latest Results</Text>
            <View style={styles.grid}>
              <Metric label="Idle Ping" value={`${Math.round(result.idlePingMs)} ms`} theme={theme} />
              <Metric label="Download" value={`${result.downloadSpeedMbps.toFixed(2)} Mbps`} theme={theme} />
              <Metric label="Upload" value={`${result.uploadSpeedMbps.toFixed(2)} Mbps`} theme={theme} />
              <Metric label="Ping @ Download" value={fmtMs(result.downloadPingMs)} theme={theme} />
              <Metric label="Ping @ Upload" value={fmtMs(result.uploadPingMs)} theme={theme} />
              <Metric label="Packet Loss" value={`${result.packetLossPercent.toFixed(1)} %`} theme={theme} />
            </View>
          </View>
        )}

        <View style={{ marginTop: 12 }}>
          {running ? (
            <View style={[styles.running, { borderColor: theme.colors.border, backgroundColor: theme.colors.card }]}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
              <Text style={{ color: theme.colors.textSecondary, marginLeft: 8, fontWeight: '600' }}>Running test…</Text>
            </View>
          ) : (
            <CustomButton title={stage === 'idle' ? 'Run Test' : 'Run Test Again'} onPress={runTest} />
          )}
        </View>
      </View>
    </ScreenContainer>
  );
}

function Metric({ label, value, theme }: any) {
  return (
    <View style={[styles.metric, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
      <Text style={{ color: theme.colors.textSecondary, fontSize: 12, fontWeight: '600' }}>{label}</Text>
      <Text style={{ color: theme.colors.text, fontSize: 16, fontWeight: '700', marginTop: 4 }}>{value}</Text>
    </View>
  );
}
const fmtMs = (v: number) => (Number.isFinite(v) ? `${Math.round(v)} ms` : '—');

async function pingOnce(timeoutMs = 5000): Promise<number> {
  const start = Date.now();
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    await fetch('https://jsonplaceholder.typicode.com/todos/1', { cache: 'no-store', signal: controller.signal });
    return Date.now() - start;
  } finally { clearTimeout(t); }
}
async function measureIdlePing() {
  const vals: number[] = []; let failures = 0;
  for (let i = 0; i < 3; i++) { try { vals.push(await pingOnce()); } catch { failures++; } }
  if (!vals.length) throw new Error('No ping endpoint reachable');
  return { value: vals.reduce((a,b)=>a+b,0)/vals.length, failures };
}
async function measureDownload() {
  const bytesTarget = 2 * 1024 * 1024; // 2MB for mobile-friendly
  const pings: number[] = []; let attempts = 0; let failures = 0;
  const pingLoop = setInterval(async () => { attempts++; try { pings.push(await pingOnce(4000)); } catch { failures++; } }, 400);
  const start = Date.now();
  try {
    const res = await fetch(`https://speed.cloudflare.com/__down?bytes=${bytesTarget}`, { cache: 'no-store' });
    const buf = await res.arrayBuffer();
    const ms = Date.now() - start;
    const mbps = (buf.byteLength * 8) / (ms / 1000) / 1_000_000;
    return { mbps, pingMs: pings.length ? avg(pings) : NaN, attempts, failures };
  } finally { clearInterval(pingLoop); }
}
async function measureUpload() {
  const size = 1 * 1024 * 1024;
  const payload = new Uint8Array(size);
  for (let i=0;i<payload.length;i++) payload[i]=(i*31+7)&0xff;
  const pings: number[] = []; let attempts = 0; let failures = 0;
  const pingLoop = setInterval(async () => { attempts++; try { pings.push(await pingOnce(4000)); } catch { failures++; } }, 400);
  const start = Date.now();
  try {
    await fetch('https://speed.cloudflare.com/__up', { method: 'POST', body: payload as any, headers: { 'Content-Type': 'application/octet-stream' } });
    const ms = Date.now() - start;
    const mbps = (size * 8) / (ms / 1000) / 1_000_000;
    return { mbps, pingMs: pings.length ? avg(pings) : NaN, attempts, failures };
  } finally { clearInterval(pingLoop); }
}
const avg = (a: number[]) => a.reduce((x,y)=>x+y,0)/a.length;

const styles = StyleSheet.create({
  hero: { borderWidth: 1, borderRadius: 24, padding: 24, alignItems: 'center', marginBottom: 12 },
  circle: { width: 88, height: 88, borderRadius: 44, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  heroTitle: { fontSize: 22, fontWeight: '700' },
  heroSub: { fontSize: 14, marginTop: 6, textAlign: 'center' },
  card: { borderWidth: 1, borderRadius: 20, padding: 16 },
  section: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  metric: { width: '48%', borderWidth: 1, borderRadius: 12, padding: 12 },
  running: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderWidth: 1, borderRadius: 12 },
});
