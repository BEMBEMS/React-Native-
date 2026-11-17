import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import CustomHeader from '../components/CustomHeader';
import ProfileCard from '../components/ProfileCard';
import CustomButton from '../components/CustomButton';
import { useTheme } from '../context/ThemeContext';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const [name, setName] = useState('Carlo Student');
  const [draft, setDraft] = useState(name);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    if (savedMsg) {
      const t = setTimeout(() => setSavedMsg(''), 2000);
      return () => clearTimeout(t);
    }
  }, [savedMsg]);

  const onSave = () => {
    if (draft.trim()) {
      setName(draft.trim());
      setSavedMsg('Profile name updated.');
    }
  };

  return (
    <ScreenContainer>
      <CustomHeader title="Profile" subtitle="Student information" />
      <View style={styles.body}>
        <ProfileCard
          name={name}
          studentId="2024-00000"
          email="student@example.com"
        />
        <View style={[styles.editBox, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Update Display Name</Text>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Enter name"
            placeholderTextColor={theme.colors.textSecondary}
            style={[
              styles.input,
              { color: theme.colors.text, borderColor: theme.colors.border, backgroundColor: theme.colors.background },
            ]}
          />
          <CustomButton title="Save" onPress={onSave} />
          {savedMsg ? <Text style={[styles.saved, { color: theme.colors.primary }]}>{savedMsg}</Text> : null}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: {
    marginTop: 12,
  },
  editBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 15,
  },
  saved: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '500',
  },
});
