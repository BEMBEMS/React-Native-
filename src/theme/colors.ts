export type ThemeColors = {
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  primary: string;
  border: string;
  header: string;
  toggleTrack: string;
  toggleThumb: string;
};

export type Theme = {
  mode: 'light' | 'dark';
  colors: ThemeColors;
};

export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    background: '#F4F6F8',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#5C6670',
    primary: '#2563EB',
    border: '#E2E8F0',
    header: '#FFFFFF',
    toggleTrack: '#CBD5E1',
    toggleThumb: '#FFFFFF',
  },
};

export const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    background: '#0F172A',
    surface: '#1E293B',
    card: '#1E293B',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    primary: '#60A5FA',
    border: '#334155',
    header: '#1E293B',
    toggleTrack: '#3B82F6',
    toggleThumb: '#FFFFFF',
  },
};
