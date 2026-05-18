import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeTheme } from '../constants/theme';

const KEY = '@bistro/theme';

export const useThemeStore = create((set, get) => ({
  dark: false,
  accent: 'ember',
  theme: makeTheme(),

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      if (raw) {
        const { dark, accent } = JSON.parse(raw);
        set({ dark: !!dark, accent: accent || 'ember', theme: makeTheme({ dark, accent }) });
      }
    } catch {}
  },

  toggleDark: () => {
    const dark = !get().dark;
    set({ dark, theme: makeTheme({ dark, accent: get().accent }) });
    AsyncStorage.setItem(KEY, JSON.stringify({ dark, accent: get().accent }));
  },

  setAccent: (accent) => {
    set({ accent, theme: makeTheme({ dark: get().dark, accent }) });
    AsyncStorage.setItem(KEY, JSON.stringify({ dark: get().dark, accent }));
  },
}));
