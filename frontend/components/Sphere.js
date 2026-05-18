import React, { useMemo } from 'react';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import { lighten, darken } from '../lib/color';

let _gid = 0;

// A shaded 3D sphere — the building block for ingredient dots, vessel blobs,
// and chip dots. Highlight top-left, core color, darkened rim.
export function Sphere({ size = 12, color = '#c44a25', highlight = 0.55, style }) {
  const id = useMemo(() => 'sph' + ++_gid, []);
  const hi = lighten(color, highlight);
  const rim = darken(color, 0.42);
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
      <Defs>
        <RadialGradient id={id} cx="34%" cy="30%" r="78%">
          <Stop offset="0%" stopColor={hi} />
          <Stop offset="46%" stopColor={color} />
          <Stop offset="100%" stopColor={rim} />
        </RadialGradient>
      </Defs>
      <Circle cx="50" cy="50" r="49" fill={`url(#${id})`} />
    </Svg>
  );
}
