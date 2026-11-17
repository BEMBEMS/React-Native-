import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import CustomHeader from '../components/CustomHeader';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';

export default function SettingsScreen() {
  const { theme } = useTheme();
  return (
    <ScreenContainer>
      <CustomHeader title="Settings" subtitle="Application preferences" />
      <View style={styles.body}>
        <Text style={[styles.section, { color: theme.colors.text }]}>Appearance</Text>
        <ThemeToggle />

        <Text style={[styles.section, { color: theme.colors.text }]}>About</Text>
        <View style={[styles.info, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.infoTitle, { color: theme.colors.text }]}>React Native Portfolio</Text>
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>Version 1.0.0</Text>
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
            A multi-screen laboratory compilation app built with Expo and React Native.
          </Text>
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
            Active theme: {theme.mode === 'dark' ? 'Dark' : 'Light'}
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: {
    marginTop: 12,
  },
  section: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 10,
  },
  info: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
});
