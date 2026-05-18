import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Ellipse } from 'react-native-svg';

let _hid = 0;

// Ambient color wash behind a dish hero — NOT a fake photo, just atmosphere.
const KINDS = {
  hot:    [['#ffaa5a', 0.55, 30, 30], ['#c1452f', 0.35, 70, 70]],
  fresh:  [['#b4d282', 0.5, 35, 25], ['#508259', 0.32, 70, 75]],
  earth:  [['#dcbe82', 0.45, 30, 30], ['#6e503a', 0.4, 70, 70]],
  citrus: [['#ffdc82', 0.5, 30, 30], ['#dc825f', 0.3, 70, 70]],
  creamy: [['#ffebc8', 0.6, 35, 30], ['#c8a06e', 0.35, 65, 75]],
};

export function HeroAmbient({ kind = 'hot', style }) {
  const id = useMemo(() => 'amb' + ++_hid, []);
  const blobs = KINDS[kind] || KINDS.hot;
  return (
    <View style={[StyleSheet.absoluteFill, style]} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <Defs>
          {blobs.map(([color, op], i) => (
            <RadialGradient key={i} id={`${id}${i}`} cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={color} stopOpacity={op} />
              <Stop offset="100%" stopColor={color} stopOpacity="0" />
            </RadialGradient>
          ))}
        </Defs>
        {blobs.map(([, , cx, cy], i) => (
          <Ellipse key={i} cx={cx} cy={cy} rx="55" ry="48" fill={`url(#${id}${i})`} />
        ))}
      </Svg>
    </View>
  );
}
