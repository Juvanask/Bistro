import React, { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Ellipse } from 'react-native-svg';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, withDelay, Easing, cancelAnimation,
} from 'react-native-reanimated';

let _sid = 0;

function Wisp({ delay, x, rise }) {
  const id = useMemo(() => 'stm' + ++_sid, []);
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withDelay(delay, withRepeat(withTiming(1, { duration: 4200, easing: Easing.out(Easing.quad) }), -1, false));
    return () => cancelAnimation(p);
  }, []);
  const style = useAnimatedStyle(() => ({
    opacity: p.value < 0.2 ? p.value * 3.5 : (1 - p.value) * 0.9,
    transform: [{ translateY: -p.value * rise }, { scale: 0.6 + p.value * 1.1 }],
  }));
  return (
    <Animated.View style={[{ position: 'absolute', bottom: '34%', left: `${x}%`, width: 26, height: 54 }, style]}>
      <Svg width={26} height={54} viewBox="0 0 26 54">
        <Defs>
          <RadialGradient id={id} cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#fff6e8" stopOpacity="0.5" />
            <Stop offset="65%" stopColor="#fff6e8" stopOpacity="0.12" />
            <Stop offset="100%" stopColor="#fff6e8" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Ellipse cx="13" cy="27" rx="13" ry="27" fill={`url(#${id})`} />
      </Svg>
    </Animated.View>
  );
}

// Soft steam rising — for hot dishes.
export function Steam({ rise = 150 }) {
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }} pointerEvents="none">
      <Wisp delay={0} x={40} rise={rise} />
      <Wisp delay={1400} x={50} rise={rise} />
      <Wisp delay={2700} x={58} rise={rise} />
      <Wisp delay={3600} x={45} rise={rise} />
    </View>
  );
}
