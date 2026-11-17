import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import CustomHeader from '../../components/CustomHeader';
import CustomButton from '../../components/CustomButton';
import { useTheme } from '../../context/ThemeContext';

export default function Activity1ProfileScreen() {
  const { theme } = useTheme();
  const [userName, setUserName] = useState('Student');
  const [draft, setDraft] = useState('');

  const onSave = () => {
    if (draft.trim()) {
      setUserName(draft.trim());
      setDraft('');
    }
  };

  return (
    <ScreenContainer>
      <CustomHeader title="Student Information" subtitle="Activity 1 - Profile" />
      <View style={styles.body}>
        <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={[styles.name, { color: theme.colors.text }]}>{userName}</Text>
        <Text style={[styles.role, { color: theme.colors.textSecondary }]}>Student - React Native Portfolio</Text>

        <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.section, { color: theme.colors.text }]}>Update Name</Text>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Enter your name"
            placeholderTextColor={theme.colors.textSecondary}
            style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border, backgroundColor: theme.colors.background }]}
          />
          <CustomButton title="Save" onPress={onSave} />
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.section, { color: theme.colors.text }]}>Details</Text>
          <Row label="Email" value="student@example.com" theme={theme} />
          <Row label="Course" value="React Native Development" theme={theme} />
          <Row label="Activity" value="Portfolio & State Management" theme={theme} />
        </View>
      </View>
    </ScreenContainer>
  );
}

function Row({ label, value, theme }: { label: string; value: string; theme: any }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.value, { color: theme.colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { marginTop: 16, alignItems: 'center' },
  avatar: { width: 90, height: 90, borderRadius: 45, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { color: '#fff', fontSize: 36, fontWeight: '700' },
  name: { fontSize: 22, fontWeight: '700' },
  role: { fontSize: 14, marginTop: 4, marginBottom: 20 },
  card: { width: '100%', padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  section: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  input: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12, fontSize: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  label: { fontSize: 14 },
  value: { fontSize: 14, fontWeight: '600', flexShrink: 1, textAlign: 'right' },
});
