import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { LeaOrb } from '../components/LeaOrb';
import { Display, Body, Eyebrow, Btn } from '../components/atoms';
import { Mic } from '../components/Icons';
import { useThemeStore } from '../store/themeStore';
import { useUiStore } from '../store/uiStore';

// Welcome — Léa-led entrance.
export default function Welcome() {
  const t = useThemeStore((s) => s.theme);
  const router = useRouter();
  const setVoiceOpen = useUiStore((s) => s.setVoiceOpen);
  const greet = greeting();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 34 }}>
        <Animated.View entering={FadeIn.duration(900)} style={{ marginBottom: 38 }}>
          <LeaOrb size={124} state="idle" halo />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(550).duration(650)} style={{ alignItems: 'center' }}>
          <Eyebrow style={{ marginBottom: 16 }}>Bistro · Tonight</Eyebrow>
          <Display size={44} style={{ textAlign: 'center' }}>{greet}</Display>
          <Display size={44} color={t.lea3} style={{ textAlign: 'center', marginTop: 2 }}>
            Let’s eat.
          </Display>
          <Body size={16} color={t.inkSoft} style={{ textAlign: 'center', marginTop: 16, lineHeight: 24, maxWidth: 290 }}>
            I’m Léa — your table’s ready. Tell me what you’re craving, or browse the kitchen yourself.
          </Body>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInUp.delay(1300).duration(650)} style={{ paddingHorizontal: 26, paddingBottom: 16, gap: 12 }}>
        <Btn kind="lea" height={56} onPress={() => router.replace('/chat')}>Order with Léa</Btn>
        <Btn kind="ghost" height={52} onPress={() => router.replace('/home')}>Browse the menu</Btn>
        <Pressable
          onPress={() => setVoiceOpen(true)}
          style={({ pressed }) => ({ alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6, opacity: pressed ? 0.5 : 1, paddingVertical: 6 })}
        >
          <Mic size={12} color={t.inkFaint} />
          <Eyebrow>or just say it</Eyebrow>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return 'Late night.';
  if (h < 12) return 'Good morning.';
  if (h < 17) return 'Good afternoon.';
  return 'Good evening.';
}
