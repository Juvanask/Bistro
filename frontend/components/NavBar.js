import React from 'react';
import { View, Pressable } from 'react-native';
import { Glass } from './Glass';
import { Body } from './atoms';
import { Back } from './Icons';
import { useThemeStore } from '../store/themeStore';
import { RADIUS } from '../constants/theme';
import { tap } from '../lib/haptics';

// Floating nav row — glass back button + centered title.
export function NavBar({ onBack, title, right }) {
  const t = useThemeStore((s) => s.theme);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 8 }}>
      {onBack ? (
        <Pressable onPress={() => { tap(); onBack(); }} style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.92 : 1 }] })}>
          <Glass strong radius={RADIUS.full} style={{ width: 38, height: 38, alignItems: 'center', justifyContent: 'center' }}>
            <Back size={16} color={t.ink} />
          </Glass>
        </Pressable>
      ) : (
        <View style={{ width: 38 }} />
      )}
      <Body size={15} weight="600" style={{ flex: 1, textAlign: 'center' }} numberOfLines={1}>
        {title}
      </Body>
      <View style={{ width: 38, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
}
