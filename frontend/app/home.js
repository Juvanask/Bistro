import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Glass } from '../components/Glass';
import { LeaOrb } from '../components/LeaOrb';
import { Display, Body, Eyebrow, Btn } from '../components/atoms';
import { DishCard, DishRow } from '../components/DishCard';
import { Moon } from '../components/Icons';
import { findItem, HOT } from '../constants/menu';
import { useThemeStore } from '../store/themeStore';
import { useChatStore } from '../store/chatStore';
import { addDish } from '../lib/dishActions';
import { useOpenDish } from '../lib/useOpenDish';
import { RADIUS } from '../constants/theme';
import { tap } from '../lib/haptics';

const FEATURED = [10, 13, 20, 11, 3];

export default function Home() {
  const t = useThemeStore((s) => s.theme);
  const toggleDark = useThemeStore((s) => s.toggleDark);
  const router = useRouter();
  const send = useChatStore((s) => s.send);
  const openDish = useOpenDish();

  const hot = HOT.map(findItem).filter(Boolean);
  const featured = FEATURED.map(findItem).filter(Boolean);

  const goChat = (text) => {
    router.replace('/chat');
    if (text) setTimeout(() => send(text), 250);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>
        <SafeAreaView edges={['top']}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8 }}>
            <View>
              <Eyebrow>Bistro</Eyebrow>
              <Body size={13} color={t.inkSoft} style={{ marginTop: 3 }}>{timeLabel()} · Table 12</Body>
            </View>
            <Pressable onPress={() => { tap(); toggleDark(); }}>
              <Glass strong radius={RADIUS.full} style={{ width: 38, height: 38, alignItems: 'center', justifyContent: 'center' }}>
                <Moon size={16} color={t.ink} />
              </Glass>
            </Pressable>
          </View>
        </SafeAreaView>

        {/* hero greeting */}
        <Animated.View entering={FadeInUp.duration(500)} style={{ paddingHorizontal: 20, paddingTop: 14 }}>
          <Glass style={{ padding: 22, overflow: 'hidden' }}>
            <View style={{ position: 'absolute', top: -38, right: -34, opacity: 0.9 }}>
              <LeaOrb size={132} state="idle" />
            </View>
            <Eyebrow style={{ marginBottom: 8 }}>Léa · live</Eyebrow>
            <Display size={27} style={{ maxWidth: 220, marginBottom: 12 }}>
              What are you{'\n'}in the mood for?
            </Display>
            <Body size={13} color={t.inkSoft} style={{ maxWidth: 240, lineHeight: 19, marginBottom: 16 }}>
              Tell me a craving or a vibe — I’ll plate it. The chicken’s hot and the kitchen just pulled white peaches.
            </Body>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Btn kind="lea" height={40} onPress={() => goChat()} style={{ paddingHorizontal: 18 }} textStyle={{ fontSize: 13 }}>
                Order with Léa
              </Btn>
              <Btn kind="ghost" height={40} onPress={() => router.replace('/menu')} style={{ paddingHorizontal: 18 }} textStyle={{ fontSize: 13 }}>
                Browse menu
              </Btn>
            </View>
          </Glass>
        </Animated.View>

        {/* what's hot */}
        <SectionH eyebrow="Tonight" title="What’s hot" />
        <View style={{ paddingHorizontal: 20, gap: 10 }}>
          {hot.map((d) => (
            <DishRow key={d.id} dish={d} onPress={(e) => openDish(d, e)} onAdd={() => addDish(d.id)} />
          ))}
        </View>

        {/* chef's specials */}
        <SectionH eyebrow="From the pass" title="Chef’s specials" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12, paddingBottom: 8 }}>
          {featured.map((d) => (
            <View key={d.id} style={{ width: 264 }}>
              <DishCard dish={d} onPress={(e) => openDish(d, e)} onAdd={() => addDish(d.id)} />
            </View>
          ))}
        </ScrollView>

        <View style={{ alignItems: 'center', paddingTop: 26 }}>
          <Eyebrow style={{ opacity: 0.5 }}>est. 2024 · plated to order</Eyebrow>
        </View>
      </ScrollView>
    </View>
  );
}

function SectionH({ eyebrow, title }) {
  return (
    <View style={{ paddingHorizontal: 20, marginTop: 24, marginBottom: 12, gap: 3 }}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Display size={22}>{title}</Display>
    </View>
  );
}

function timeLabel() {
  const h = new Date().getHours();
  if (h < 5) return 'Late night';
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  if (h < 21) return 'Evening';
  return 'Night';
}
