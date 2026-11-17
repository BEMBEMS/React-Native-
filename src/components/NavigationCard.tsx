import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

type Props = {
  title: string;
  description: string;
  onPress: () => void;
};

export default function NavigationCard({ title, description, onPress }: Props) {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.row}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
        <Text style={[styles.chevron, { color: theme.colors.primary }]}>›</Text>
      </View>
      <Text style={[styles.description, { color: theme.colors.textSecondary }]}>{description}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  chevron: {
    fontSize: 22,
    fontWeight: '600',
  },
  description: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
  },
});
