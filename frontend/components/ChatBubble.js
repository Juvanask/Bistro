import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, withDelay, Easing } from 'react-native-reanimated';
import { Body } from './atoms';
import { Glass } from './Glass';
import { useThemeStore } from '../store/themeStore';
import { RADIUS } from '../constants/theme';
import { withAlpha } from '../lib/color';

// Spring-in chat bubble. from: 'lea' | 'user'
export function Bubble({ from = 'lea', children, animate = true }) {
  const t = useThemeStore((s) => s.theme);
  const isUser = from === 'user';

  const o = useSharedValue(animate ? 0 : 1);
  const y = useSharedValue(animate ? 8 : 0);
  const sc = useSharedValue(animate ? 0.96 : 1);
  useEffect(() => {
    o.value = withTiming(1, { duration: 320 });
    y.value = withTiming(0, { duration: 350, easing: Easing.out(Easing.cubic) });
    sc.value = withTiming(1, { duration: 350, easing: Easing.out(Easing.back(1.4)) });
  }, []);
  const aStyle = useAnimatedStyle(() => ({ opacity: o.value, transform: [{ translateY: y.value }, { scale: sc.value }] }));

  return (
    <Animated.View
      style={[
        {
          alignSelf: isUser ? 'flex-end' : 'flex-start',
          maxWidth: '86%',
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 22,
          borderBottomRightRadius: isUser ? 8 : 22,
          borderBottomLeftRadius: isUser ? 22 : 8,
          backgroundColor: isUser ? t.ink : withAlpha(t.lea2, t.dark ? 0.2 : 0.16),
          borderWidth: isUser ? 0 : 0.5,
          borderColor: withAlpha(t.lea2, 0.28),
        },
        aStyle,
      ]}
    >
      {typeof children === 'string' ? (
        <Body size={15} color={isUser ? t.bg : t.ink} style={{ lineHeight: 21 }}>{children}</Body>
      ) : (
        children
      )}
    </Animated.View>
  );
}

// Léa typing indicator — three pulsing dots.
export function TypingBubble() {
  const t = useThemeStore((s) => s.theme);
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        paddingVertical: 14, paddingHorizontal: 18,
        borderRadius: 22, borderBottomLeftRadius: 8,
        backgroundColor: withAlpha(t.lea2, t.dark ? 0.2 : 0.16),
        borderWidth: 0.5, borderColor: withAlpha(t.lea2, 0.28),
        flexDirection: 'row', gap: 4,
      }}
    >
      <Dot delay={0} /><Dot delay={150} /><Dot delay={300} />
    </View>
  );
}

function Dot({ delay }) {
  const t = useThemeStore((s) => s.theme);
  const v = useSharedValue(0.4);
  useEffect(() => {
    const loop = () => {
      v.value = withDelay(delay, withSequence(
        withTiming(1, { duration: 360 }),
        withTiming(0.4, { duration: 360 }),
      ));
    };
    loop();
    const iv = setInterval(loop, 1080);
    return () => clearInterval(iv);
  }, []);
  const style = useAnimatedStyle(() => ({ opacity: v.value, transform: [{ translateY: (1 - v.value) * 4 }] }));
  return <Animated.View style={[{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: t.lea3 }, style]} />;
}

// Centered system note.
export function SystemBubble({ children }) {
  const t = useThemeStore((s) => s.theme);
  return (
    <Glass radius={RADIUS.full} style={{ alignSelf: 'center', paddingVertical: 7, paddingHorizontal: 14 }}>
      <Body size={12} color={t.inkSoft}>{children}</Body>
    </Glass>
  );
}
