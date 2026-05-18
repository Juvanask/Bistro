import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useThemeStore } from '../store/themeStore';
import { RADIUS } from '../constants/theme';

// Translucent glass surface. ONE tint layer (so the warm paper bleeds through —
// never solid), a clipped blur backdrop that never catches touches, and the
// content in its own layer explicitly above it.
export function Glass({ children, strong = false, dim = false, radius = RADIUS.lg, style, ...rest }) {
  const t = useThemeStore((s) => s.theme);
  const tint = strong ? t.surfaceStrong : dim ? t.surfaceDim : t.surface;
  const intensity = strong ? 40 : dim ? 16 : 26;

  return (
    <View
      {...rest}
      style={{
        borderRadius: radius,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: t.dark ? 0.34 : 0.1,
        shadowRadius: 20,
        elevation: 5,
      }}
    >
      {/* backdrop — blur + a single translucent tint; decorative, no touches */}
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { borderRadius: radius, overflow: 'hidden' }]}>
        <BlurView intensity={intensity} tint={t.blurTint} style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: tint }]} />
      </View>
      {/* content — above the backdrop, carries layout + hairline */}
      <View style={[{ borderRadius: radius, borderWidth: 0.5, borderColor: t.glassBorder }, style]}>
        {children}
      </View>
    </View>
  );
}
