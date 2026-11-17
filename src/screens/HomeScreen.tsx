import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenContainer from '../components/ScreenContainer';
import CustomHeader from '../components/CustomHeader';
import NavigationCard from '../components/NavigationCard';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const { theme } = useTheme();
  return (
    <ScreenContainer scroll={false}>
      <CustomHeader title="React Native Portfolio" subtitle="Laboratory Compilation App" />
      <View style={styles.body}>
        <View style={[styles.welcome, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.welcomeTitle, { color: theme.colors.text }]}>Welcome!</Text>
          <Text style={[styles.welcomeText, { color: theme.colors.textSecondary }]}>
            Access your laboratory activities, profile, and settings from one place.
          </Text>
          <Text style={[styles.themeNote, { color: theme.colors.primary }]}>
            Current theme: {theme.mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Quick Access</Text>
        <NavigationCard
          title="Laboratory Activities"
          description="Browse and open compiled laboratory activities."
          onPress={() => navigation.navigate('Activities')}
        />
        <NavigationCard
          title="Profile"
          description="View your student and user information."
          onPress={() => navigation.navigate('Profile')}
        />
        <NavigationCard
          title="Settings"
          description="Customize appearance and app preferences."
          onPress={() => navigation.navigate('Settings')}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    padding: 16,
  },
  welcome: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  welcomeText: {
    fontSize: 14,
    lineHeight: 20,
  },
  themeNote: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
});
