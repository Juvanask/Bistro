import React from 'react';
import { View, Pressable } from 'react-native';
import { Glass } from './Glass';
import { Display, Eyebrow, Price } from './atoms';
import { IngredientDots } from './IngredientDots';
import { HeatDots } from './HeatDots';
import { Plus } from './Icons';
import { useThemeStore } from '../store/themeStore';
import { RADIUS } from '../constants/theme';
import { tap, success } from '../lib/haptics';

function AddButton({ onPress, size = 32 }) {
  const t = useThemeStore((s) => s.theme);
  return (
    <Pressable
      onPress={() => { success(); onPress(); }}
      hitSlop={8}
      style={({ pressed }) => ({
        width: size, height: size, borderRadius: size / 2,
        backgroundColor: t.ink, alignItems: 'center', justifyContent: 'center',
        transform: [{ scale: pressed ? 0.86 : 1 }],
        shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3,
      })}
    >
      <Plus size={size * 0.5} color={t.bg} />
    </Pressable>
  );
}

// Tasting-menu card. A fixed-height top block keeps every card in a rail the
// same size regardless of how the dish name wraps.
export function DishCard({ dish, onPress, onAdd, compact = false }) {
  const topHeight = compact ? 66 : 82;
  return (
    <Pressable onPress={onPress ? (e) => { tap(); onPress(e); } : undefined} style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.98 : 1 }] })}>
      <Glass style={{ padding: compact ? 14 : 18 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12, height: topHeight }}>
          <View style={{ flex: 1 }}>
            <Display size={compact ? 20 : 24} numberOfLines={2}>{dish.name}</Display>
            <Eyebrow numberOfLines={2} style={{ marginTop: 5 }}>{dish.tagline}</Eyebrow>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 6 }}>
            <Price value={dish.price} size={15} />
            {dish.heat > 0 ? <HeatDots level={dish.heat} /> : null}
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <IngredientDots palette={dish.palette} />
          {onAdd ? <AddButton onPress={() => onAdd(dish)} /> : null}
        </View>
      </Glass>
    </Pressable>
  );
}

// Compact full-width list row.
export function DishRow({ dish, onPress, onAdd }) {
  return (
    <Pressable onPress={onPress ? (e) => { tap(); onPress(e); } : undefined} style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.985 : 1 }] })}>
      <Glass radius={RADIUS.md} style={{ padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ flex: 1, gap: 7 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
            <Display size={19} numberOfLines={1} style={{ flex: 1 }}>{dish.name}</Display>
            <Price value={dish.price} size={13} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <IngredientDots palette={dish.palette.slice(0, 5)} />
            {dish.heat > 0 ? <HeatDots level={dish.heat} /> : null}
          </View>
        </View>
        {onAdd ? <AddButton size={30} onPress={() => onAdd(dish)} /> : null}
      </Glass>
    </Pressable>
  );
}
