import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, isDark, toggleTheme } = useTheme();
  return (
    <View style={[styles.row, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View>
        <Text style={[styles.label, { color: theme.colors.text }]}>Dark Mode</Text>
        <Text style={[styles.sub, { color: theme.colors.textSecondary }]}>
          {isDark ? 'Dark theme is enabled' : 'Light theme is enabled'}
        </Text>
      </View>
      <Switch
        value={isDark}
        onValueChange={toggleTheme}
        trackColor={{ false: theme.colors.toggleTrack, true: theme.colors.toggleTrack }}
        thumbColor={theme.colors.toggleThumb}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  sub: {
    fontSize: 13,
    marginTop: 2,
  },
});
