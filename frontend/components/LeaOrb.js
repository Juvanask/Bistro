import React, { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Circle, Ellipse } from 'react-native-svg';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing, cancelAnimation,
} from 'react-native-reanimated';
import { useThemeStore } from '../store/themeStore';

let _oid = 0;

// Léa's "face" — an animated ember sphere with an ambient halo.
// state: idle | listening | thinking
export function LeaOrb({ size = 56, state = 'idle', halo = false, style }) {
  const t = useThemeStore((s) => s.theme);
  const id = useMemo(() => 'orb' + ++_oid, []);

  const scale = useSharedValue(1);
  const rot = useSharedValue(0);
  const haloV = useSharedValue(0.55);

  useEffect(() => {
    cancelAnimation(scale);
    cancelAnimation(rot);
    rot.value = 0;
    if (state === 'listening') {
      scale.value = withRepeat(withSequence(
        withTiming(1.08, { duration: 900, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.quad) }),
      ), -1, false);
    } else if (state === 'thinking') {
      scale.value = withRepeat(withSequence(
        withTiming(1.02, { duration: 600 }), withTiming(0.98, { duration: 600 }),
      ), -1, true);
      rot.value = withRepeat(withSequence(
        withTiming(-3, { duration: 600 }), withTiming(3, { duration: 600 }),
      ), -1, true);
    } else {
      scale.value = withRepeat(withSequence(
        withTiming(1.045, { duration: 3000, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.quad) }),
      ), -1, false);
    }
    return () => { cancelAnimation(scale); cancelAnimation(rot); };
  }, [state]);

  useEffect(() => {
    if (halo) {
      haloV.value = withRepeat(withSequence(
        withTiming(0.85, { duration: 4000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.5, { duration: 4000, easing: Easing.inOut(Easing.quad) }),
      ), -1, false);
    }
    return () => cancelAnimation(haloV);
  }, [halo]);

  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rot.value}deg` }],
  }));
  const haloStyle = useAnimatedStyle(() => ({ opacity: haloV.value }));

  const haloSize = size * 2;

  return (
    <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
      {halo ? (
        <Animated.View
          pointerEvents="none"
          style={[
            { position: 'absolute', width: haloSize, height: haloSize },
            haloStyle,
          ]}
        >
          <Svg width={haloSize} height={haloSize} viewBox="0 0 100 100">
            <Defs>
              <RadialGradient id={id + 'h'} cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor={t.lea2} stopOpacity="0.42" />
                <Stop offset="62%" stopColor={t.lea2} stopOpacity="0.12" />
                <Stop offset="100%" stopColor={t.lea2} stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Circle cx="50" cy="50" r="50" fill={`url(#${id}h)`} />
          </Svg>
        </Animated.View>
      ) : null}

      <Animated.View style={[{ width: size, height: size }, orbStyle]}>
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Defs>
            <RadialGradient id={id} cx="32%" cy="26%" r="86%">
              <Stop offset="0%" stopColor={t.lea1} />
              <Stop offset="34%" stopColor={t.lea2} />
              <Stop offset="70%" stopColor={t.lea3} />
              <Stop offset="100%" stopColor={t.lea4} />
            </RadialGradient>
            <RadialGradient id={id + 's'} cx="32%" cy="24%" r="42%">
              <Stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
              <Stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Circle cx="50" cy="50" r="48" fill={`url(#${id})`} />
          <Ellipse cx="36" cy="30" rx="22" ry="15" fill={`url(#${id}s)`} />
        </Svg>
      </Animated.View>
    </View>
  );
}
