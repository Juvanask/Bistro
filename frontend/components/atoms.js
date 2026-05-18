import React from 'react';
import { Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FONTS, RADIUS } from '../constants/theme';
import { useThemeStore } from '../store/themeStore';
import { tap } from '../lib/haptics';

// ─── Display — italic serif headline ───────────────────────────────
export function Display({ children, size = 28, up = false, color, style, numberOfLines }) {
  const t = useThemeStore((s) => s.theme);
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        {
          fontFamily: up ? FONTS.displayUp : FONTS.display,
          fontSize: size,
          lineHeight: size * 1.06,
          letterSpacing: -0.4,
          color: color || t.ink,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

// ─── Body — Geist ──────────────────────────────────────────────────
export function Body({ children, size = 14, weight = '400', color, style, numberOfLines, ...rest }) {
  const t = useThemeStore((s) => s.theme);
  const family = weight === '600' ? FONTS.bodyBold : weight === '500' ? FONTS.bodyMed : FONTS.body;
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[{ fontFamily: family, fontSize: size, color: color || t.ink, letterSpacing: -0.1 }, style]}
      {...rest}
    >
      {children}
    </Text>
  );
}

// ─── Eyebrow — mono uppercase label ────────────────────────────────
export function Eyebrow({ children, color, style }) {
  const t = useThemeStore((s) => s.theme);
  return (
    <Text
      style={[
        { fontFamily: FONTS.monoMed, fontSize: 10, letterSpacing: 1.7, textTransform: 'uppercase', color: color || t.inkFaint },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

// ─── Price — mono tabular ──────────────────────────────────────────
export function Price({ value, size = 14, color, style }) {
  const t = useThemeStore((s) => s.theme);
  const display = typeof value === 'number' ? `$${value.toFixed(2)}` : value;
  return (
    <Text style={[{ fontFamily: FONTS.monoMed, fontSize: size, letterSpacing: -0.2, color: color || t.ink }, style]}>
      {display}
    </Text>
  );
}

// ─── Btn ───────────────────────────────────────────────────────────
export function Btn({ children, kind = 'primary', onPress, disabled, height, style, textStyle, gradient }) {
  const t = useThemeStore((s) => s.theme);
  const label =
    typeof children === 'string' ? (
      <Text style={[{ fontFamily: FONTS.bodyBold, fontSize: 15, letterSpacing: -0.1, color: btnFg(kind, t) }, textStyle]}>
        {children}
      </Text>
    ) : (
      children
    );

  const inner = (pressed) => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: height || 50,
    paddingHorizontal: 22,
    borderRadius: RADIUS.full,
    opacity: disabled ? 0.5 : pressed ? 0.92 : 1,
    transform: [{ scale: pressed ? 0.97 : 1 }],
  });

  if (kind === 'lea') {
    const colors = gradient && gradient.length >= 2 ? gradient : [t.lea1, t.lea2, t.lea3];
    return (
      <Pressable onPress={onPress ? () => { tap(); onPress(); } : undefined} disabled={disabled} style={style}>
        {({ pressed }) => (
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[inner(pressed), {
              shadowColor: colors[colors.length - 1], shadowOpacity: 0.45, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 6,
            }]}
          >
            {label}
          </LinearGradient>
        )}
      </Pressable>
    );
  }

  const bg =
    kind === 'primary' ? t.ink : kind === 'glass' ? t.surfaceStrong : 'transparent';
  return (
    <Pressable
      onPress={onPress ? () => { tap(); onPress(); } : undefined}
      disabled={disabled}
      style={({ pressed }) => [
        inner(pressed),
        {
          backgroundColor: bg,
          borderWidth: kind === 'ghost' ? 1.5 : kind === 'glass' ? 0.5 : 0,
          borderColor: kind === 'glass' ? t.glassBorder : t.hairline,
          ...(kind === 'primary' ? { shadowColor: '#000', shadowOpacity: 0.22, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 4 } : null),
        },
        style,
      ]}
    >
      {label}
    </Pressable>
  );
}

function btnFg(kind, t) {
  if (kind === 'lea') return '#fff';
  if (kind === 'primary') return t.bg;
  return t.ink;
}
