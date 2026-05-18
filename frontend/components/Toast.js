import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { Glass } from './Glass';
import { Body } from './atoms';
import { LeaOrb } from './LeaOrb';
import { RADIUS } from '../constants/theme';

// Glass toast — slides in from the top, auto-driven by the ui store.
export function Toast({ text, accent }) {
  const o = useSharedValue(0);
  const y = useSharedValue(-12);
  useEffect(() => {
    o.value = withTiming(1, { duration: 280 });
    y.value = withTiming(0, { duration: 320, easing: Easing.out(Easing.back(1.3)) });
  }, []);
  const style = useAnimatedStyle(() => ({ opacity: o.value, transform: [{ translateY: y.value }] }));

  return (
    <Animated.View style={style}>
      <Glass strong radius={RADIUS.md} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 11, paddingHorizontal: 13 }}>
        <LeaOrb size={22} state="idle" />
        <View style={{ flex: 1 }}>
          <Body size={13} weight="500">{text}</Body>
        </View>
      </Glass>
    </Animated.View>
  );
}
