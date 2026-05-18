import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const I = (vb, render) => function Icon({ size = 20, color = '#14140f', strokeWidth = 1.7 }) {
  return (
    <Svg width={size} height={size} viewBox={vb} fill="none">
      {render(color, strokeWidth)}
    </Svg>
  );
};

export const Back = I('0 0 16 16', (c, w) => (
  <Path d="M10 3L5 8l5 5" stroke={c} strokeWidth={w + 0.3} strokeLinecap="round" strokeLinejoin="round" />
));

export const Home = I('0 0 20 20', (c, w) => (
  <Path d="M3 9l7-6 7 6v8a1 1 0 01-1 1h-4v-5H8v5H4a1 1 0 01-1-1V9z" stroke={c} strokeWidth={w} strokeLinejoin="round" />
));

export const MenuList = I('0 0 20 20', (c, w) => (
  <Path d="M4 5h12M4 10h12M4 15h8" stroke={c} strokeWidth={w} strokeLinecap="round" />
));

export const Cart = I('0 0 20 20', (c, w) => (
  <>
    <Path d="M3 4h2l2.4 9.4a1.5 1.5 0 001.5 1.1h6.3a1.5 1.5 0 001.4-1l1.7-5.4H6" stroke={c} strokeWidth={w - 0.2} strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="9" cy="17" r="1.3" fill={c} />
    <Circle cx="15" cy="17" r="1.3" fill={c} />
  </>
));

export const Plus = I('0 0 16 16', (c, w) => (
  <Path d="M8 3v10M3 8h10" stroke={c} strokeWidth={w + 0.4} strokeLinecap="round" />
));

export const Minus = I('0 0 16 16', (c, w) => (
  <Path d="M3 8h10" stroke={c} strokeWidth={w + 0.4} strokeLinecap="round" />
));

export const Send = I('0 0 16 16', (c, w) => (
  <Path d="M3 8l10-5-3.5 11-2-4.5L3 8z" stroke={c} strokeWidth={w} strokeLinejoin="round" strokeLinecap="round" fill={c} />
));

export const Mic = I('0 0 16 16', (c, w) => (
  <>
    <Rect x="5.5" y="2" width="5" height="9" rx="2.5" fill={c} />
    <Path d="M3.5 8a4.5 4.5 0 009 0M8 12.5V14" stroke={c} strokeWidth={w - 0.1} strokeLinecap="round" />
  </>
));

export const Close = I('0 0 16 16', (c, w) => (
  <Path d="M4 4l8 8M12 4l-8 8" stroke={c} strokeWidth={w} strokeLinecap="round" />
));

export const Moon = I('0 0 16 16', (c, w) => (
  <Path d="M13 9.5A5.5 5.5 0 016.5 3 5.5 5.5 0 1013 9.5z" stroke={c} strokeWidth={w - 0.2} strokeLinejoin="round" />
));

export const Search = I('0 0 16 16', (c, w) => (
  <>
    <Circle cx="7" cy="7" r="4.5" stroke={c} strokeWidth={w - 0.2} />
    <Path d="M10.5 10.5L14 14" stroke={c} strokeWidth={w} strokeLinecap="round" />
  </>
));

export const Check = I('0 0 16 16', (c, w) => (
  <Path d="M3.5 8.5l3 3 6-7.5" stroke={c} strokeWidth={w + 0.3} strokeLinecap="round" strokeLinejoin="round" />
));
