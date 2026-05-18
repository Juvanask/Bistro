import React from 'react';
import { View } from 'react-native';
import { useThemeStore } from '../store/themeStore';

// Spice level — small glowing dots, 0..max.
export function HeatDots({ level = 0, max = 5, dot = 5 }) {
  const t = useThemeStore((s) => s.theme);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
      {Array.from({ length: max }).map((_, i) => {
        const on = i < level;
        return (
          <View
            key={i}
            style={{
              width: dot,
              height: dot,
              borderRadius: dot / 2,
              backgroundColor: on ? t.tomato : t.hairline,
              shadowColor: t.tomato,
              shadowOpacity: on ? 0.55 : 0,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 0 },
            }}
          />
        );
      })}
    </View>
  );
}
