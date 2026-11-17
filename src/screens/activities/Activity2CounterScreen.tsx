import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import CustomHeader from '../../components/CustomHeader';
import { useTheme } from '../../context/ThemeContext';

export default function Activity2CounterScreen() {
  const { theme } = useTheme();
  const [counter, setCounter] = useState(0);

  return (
    <ScreenContainer scroll={false}>
      <CustomHeader title="Counter Module" subtitle="Activity 2 - Local State" />
      <View style={styles.body}>
        <Text style={[styles.heading, { color: theme.colors.text }]}>Local State Counter</Text>
        <Text style={[styles.sub, { color: theme.colors.textSecondary }]}>
          This screen uses React hooks (useState) for local state.
        </Text>
        <Text style={[styles.counter, { color: theme.colors.primary }]}>{counter}</Text>
        <View style={styles.row}>
          <CircleBtn label="−" color="#EF5350" onPress={() => setCounter((c) => (c > 0 ? c - 1 : 0))} />
          <CircleBtn label="↺" color="#78909C" onPress={() => setCounter(0)} />
          <CircleBtn label="+" color="#26A69A" onPress={() => setCounter((c) => c + 1)} />
        </View>
        <View style={styles.labels}>
          <Text style={[styles.lbl, { color: theme.colors.textSecondary }]}>Decrement</Text>
          <Text style={[styles.lbl, { color: theme.colors.textSecondary }]}>Reset</Text>
          <Text style={[styles.lbl, { color: theme.colors.textSecondary }]}>Increment</Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

function CircleBtn({ label, color, onPress }: { label: string; color: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.circle, { backgroundColor: color }]} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.circleText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  heading: { fontSize: 22, fontWeight: '700' },
  sub: { fontSize: 14, marginTop: 6, textAlign: 'center' },
  counter: { fontSize: 72, fontWeight: '800', marginVertical: 24 },
  row: { flexDirection: 'row', gap: 20 },
  circle: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  circleText: { color: '#fff', fontSize: 28, fontWeight: '700' },
  labels: { flexDirection: 'row', gap: 20, marginTop: 8 },
  lbl: { width: 72, textAlign: 'center', fontSize: 12, fontWeight: '600' },
});
