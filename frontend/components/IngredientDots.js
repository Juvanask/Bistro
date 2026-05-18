import React from 'react';
import { View, Text } from 'react-native';
import { Sphere } from './Sphere';
import { useThemeStore } from '../store/themeStore';
import { FONTS } from '../constants/theme';

const SIZES = { sm: 12, lg: 28, xl: 44 };

// The "color story" — a dish's ingredients as a row of shaded spheres.
export function IngredientDots({ palette = [], labels, size = 'sm', showLabels = false, style }) {
  const t = useThemeStore((s) => s.theme);
  const dot = SIZES[size] || SIZES.sm;
  const gap = size === 'xl' ? 10 : size === 'lg' ? 7 : 5;

  return (
    <View style={[{ gap: 6 }, style]}>
      <View style={{ flexDirection: 'row', gap, alignItems: 'center' }}>
        {palette.map((c, i) => (
          <Sphere key={i} size={dot} color={c} />
        ))}
      </View>
      {showLabels && labels ? (
        <View style={{ flexDirection: 'row', gap }}>
          {labels.map((l, i) => (
            <Text
              key={i}
              style={{
                width: dot, textAlign: 'center', fontFamily: FONTS.mono, fontSize: 8,
                letterSpacing: 0.4, textTransform: 'uppercase', color: t.inkFaint, lineHeight: 10,
              }}
              numberOfLines={2}
            >
              {l}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}
