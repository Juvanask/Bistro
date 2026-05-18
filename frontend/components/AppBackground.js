import React, { useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect, Pattern, Circle } from 'react-native-svg';
import { useThemeStore } from '../store/themeStore';

let _bid = 0;

// Warm cream "paper" canvas — four stacked layers per the design recipe:
// base cream → fine paper grain → warm sunlight from the top → amber shadow
// from the bottom-right corner.
export function AppBackground() {
  const t = useThemeStore((s) => s.theme);
  const { width, height } = useWindowDimensions();
  const id = useMemo(() => 'bg' + ++_bid, []);

  const warm = t.dark ? 'rgba(255,130,60,0.16)' : 'rgba(255,200,130,0.30)';
  const amber = t.dark ? 'rgba(120,60,24,0.26)' : 'rgba(180,120,70,0.16)';
  const grain = t.dark ? 'rgba(255,245,210,0.06)' : 'rgba(60,50,30,0.07)';

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: t.bg }]} pointerEvents="none">
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          {/* fine paper grain */}
          <Pattern id={id + 'g'} width="5" height="5" patternUnits="userSpaceOnUse">
            <Circle cx="1" cy="1" r="0.7" fill={grain} />
          </Pattern>
          {/* warm sunlight from the top */}
          <RadialGradient id={id + 'a'} cx="50%" cy="0%" r="75%">
            <Stop offset="0%" stopColor={warm} />
            <Stop offset="100%" stopColor={warm} stopOpacity="0" />
          </RadialGradient>
          {/* amber shadow, bottom-right */}
          <RadialGradient id={id + 'b'} cx="100%" cy="100%" r="80%">
            <Stop offset="0%" stopColor={amber} />
            <Stop offset="100%" stopColor={amber} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width={width} height={height} fill={`url(#${id}a)`} />
        <Rect x="0" y="0" width={width} height={height} fill={`url(#${id}b)`} />
        <Rect x="0" y="0" width={width} height={height} fill={`url(#${id}g)`} />
      </Svg>
    </View>
  );
}
