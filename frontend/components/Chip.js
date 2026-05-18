import React from 'react';
import { Pressable, View, ScrollView } from 'react-native';
import { Body } from './atoms';
import { useThemeStore } from '../store/themeStore';
import { RADIUS } from '../constants/theme';
import { withAlpha } from '../lib/color';
import { tap } from '../lib/haptics';

// Recommendation / suggestion chip. `lea` = ember-tinted.
export function Chip({ children, onPress, lea = false, dotted = false, style }) {
  const t = useThemeStore((s) => s.theme);
  return (
    <Pressable
      onPress={onPress ? () => { tap(); onPress(); } : undefined}
      style={({ pressed }) => [
        {
          flexDirection: 'row', alignItems: 'center', gap: 6,
          paddingHorizontal: 14, paddingVertical: 8,
          borderRadius: RADIUS.full,
          borderWidth: 0.5,
          backgroundColor: lea ? withAlpha(t.lea2, 0.16) : t.surface,
          borderColor: lea ? withAlpha(t.lea2, 0.4) : t.glassBorder,
          transform: [{ scale: pressed ? 0.95 : 1 }],
        },
        style,
      ]}
    >
      {dotted ? (
        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: t.lea2 }} />
      ) : null}
      <Body size={13} weight="500" color={lea ? (t.dark ? t.lea1 : t.lea4) : t.inkSoft}>
        {children}
      </Body>
    </Pressable>
  );
}

// Horizontal scrolling row of suggestion chips.
export function ChipsRow({ chips = [], onPick, lea = true, style }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingHorizontal: 20, paddingVertical: 4 }}
      style={style}
    >
      {chips.map((c, i) => (
        <Chip key={i} lea={lea} dotted={lea} onPress={() => onPick && onPick(c)}>{c}</Chip>
      ))}
    </ScrollView>
  );
}
