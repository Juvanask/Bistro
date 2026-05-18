import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, withDelay, Easing, FadeIn } from 'react-native-reanimated';
import { LeaOrb } from './LeaOrb';
import { Display, Body, Eyebrow, Btn } from './atoms';
import { useThemeStore } from '../store/themeStore';
import { useSpeechRecognition } from '../lib/speech';

function WaveBar({ delay, h }) {
  const t = useThemeStore((s) => s.theme);
  const v = useSharedValue(0.35);
  useEffect(() => {
    v.value = withDelay(delay, withRepeat(withSequence(
      withTiming(1, { duration: 520, easing: Easing.inOut(Easing.quad) }),
      withTiming(0.35, { duration: 520, easing: Easing.inOut(Easing.quad) }),
    ), -1, false));
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ scaleY: v.value }] }));
  return <Animated.View style={[{ width: 3.5, height: h, borderRadius: 2, backgroundColor: t.lea2 }, style]} />;
}

function Waveform() {
  const heights = [16, 28, 40, 24, 36, 20, 32, 16, 28, 38, 22, 30];
  return (
    <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center', height: 44 }}>
      {heights.map((h, i) => <WaveBar key={i} delay={i * 70} h={h} />)}
    </View>
  );
}

// Full-screen voice ordering overlay. Real speech recognition on web.
export function VoiceModal({ open, onClose, onSubmit }) {
  const t = useThemeStore((s) => s.theme);
  const { supported, status, transcript, partial, start, stop } = useSpeechRecognition();

  useEffect(() => {
    if (open && supported) start();
    else stop();
  }, [open]);

  if (!open) return null;

  const heard = (transcript + ' ' + partial).trim();

  const submit = () => {
    stop();
    const text = heard.trim();
    onClose();
    if (text) onSubmit(text);
  };

  return (
    <Animated.View entering={FadeIn.duration(220)} style={[StyleSheet.absoluteFill, { zIndex: 200 }]}>
      <BlurView intensity={40} tint={t.dark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: t.dark ? 'rgba(10,9,7,0.7)' : 'rgba(20,20,15,0.45)' }]} />

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 36 }}>
        <LeaOrb size={132} state={status === 'listening' ? 'listening' : 'idle'} halo />

        <View style={{ alignItems: 'center', marginTop: 36 }}>
          <Eyebrow color="#fff" style={{ opacity: 0.7 }}>
            {!supported ? 'Voice' : status === 'listening' ? 'Listening' : status === 'error' ? 'Mic unavailable' : 'Ready'}
          </Eyebrow>

          {!supported ? (
            <Body size={15} color="#fff" style={{ textAlign: 'center', marginTop: 14, lineHeight: 22, opacity: 0.9, maxWidth: 280 }}>
              Live voice ordering runs in the browser. Open the web build, or just type to Léa instead.
            </Body>
          ) : (
            <>
              <View style={{ marginTop: 22 }}><Waveform /></View>
              <Display size={24} color="#fff" style={{ textAlign: 'center', marginTop: 24, minHeight: 56, maxWidth: 300 }}>
                {heard || 'Say what you’re craving…'}
              </Display>
            </>
          )}
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginTop: 40 }}>
          <Btn kind="glass" onPress={() => { stop(); onClose(); }} style={{ paddingHorizontal: 26 }}>
            {supported ? 'Cancel' : 'Close'}
          </Btn>
          {supported ? (
            <Btn kind="lea" onPress={submit} style={{ paddingHorizontal: 26 }} disabled={!heard}>
              Send to Léa
            </Btn>
          ) : null}
        </View>
      </View>
    </Animated.View>
  );
}
