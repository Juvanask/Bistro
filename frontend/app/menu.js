import React, { useMemo, useState } from 'react';
import { View, ScrollView, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Display, Body, Eyebrow } from '../components/atoms';
import { DishRow } from '../components/DishCard';
import { Search, Close } from '../components/Icons';
import { CATEGORIES, ITEMS } from '../constants/menu';
import { addDish } from '../lib/dishActions';
import { useOpenDish } from '../lib/useOpenDish';
import { useThemeStore } from '../store/themeStore';
import { FONTS } from '../constants/theme';
import { tap } from '../lib/haptics';

export default function Menu() {
  const t = useThemeStore((s) => s.theme);
  const openDish = useOpenDish();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const q = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!q) return [];
    return ITEMS.filter((d) => `${d.name} ${d.tagline} ${d.cat}`.toLowerCase().includes(q));
  }, [q]);

  const live = focused || !!query;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 130 }}>
        <SafeAreaView edges={['top']}>
          <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
            <Eyebrow style={{ marginBottom: 8 }}>Bistro · est. 2024</Eyebrow>
            <Display size={36}>The menu,{'\n'}unfussed.</Display>

            {/* editorial search — a serif line, not a stock pill */}
            <View
              style={{
                marginTop: 20,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                borderBottomWidth: 1.5,
                borderBottomColor: live ? t.lea3 : t.hairline,
                paddingBottom: 9,
              }}
            >
              <Search size={18} color={live ? t.lea3 : t.inkFaint} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Search the kitchen…"
                placeholderTextColor={t.inkMute}
                style={{ flex: 1, fontFamily: FONTS.display, fontSize: 23, color: t.ink, paddingVertical: 2 }}
                returnKeyType="search"
              />
              {query ? (
                <Pressable onPress={() => { tap(); setQuery(''); }} hitSlop={10}>
                  <Close size={15} color={t.inkFaint} />
                </Pressable>
              ) : null}
            </View>
          </View>
        </SafeAreaView>

        {q ? (
          <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
            <Eyebrow style={{ marginBottom: 12 }}>
              {results.length} {results.length === 1 ? 'match' : 'matches'}
            </Eyebrow>
            {results.length ? (
              <View style={{ gap: 10 }}>
                {results.map((d) => (
                  <DishRow key={d.id} dish={d} onPress={(e) => openDish(d, e)} onAdd={() => addDish(d.id)} />
                ))}
              </View>
            ) : (
              <Body size={14} color={t.inkSoft} style={{ marginTop: 4, lineHeight: 21 }}>
                Nothing on the menu matches “{query.trim()}”. Léa might still know a substitute — just ask her.
              </Body>
            )}
          </View>
        ) : (
          CATEGORIES.map((cat) => {
            const dishes = ITEMS.filter((d) => d.cat === cat);
            if (!dishes.length) return null;
            return (
              <View key={cat}>
                <View style={{ paddingHorizontal: 20, marginTop: 26, marginBottom: 12, gap: 3 }}>
                  <Eyebrow>{dishes.length} dishes</Eyebrow>
                  <Display size={22}>{cat}</Display>
                </View>
                <View style={{ paddingHorizontal: 20, gap: 10 }}>
                  {dishes.map((d, i) => (
                    <Animated.View key={d.id} entering={FadeInUp.delay(i * 40).duration(380)}>
                      <DishRow dish={d} onPress={(e) => openDish(d, e)} onAdd={() => addDish(d.id)} />
                    </Animated.View>
                  ))}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
