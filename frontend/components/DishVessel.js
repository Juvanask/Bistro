import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withDelay, withTiming, Easing } from 'react-native-reanimated';
import { Steam } from './Steam';

const QUINT = Easing.bezier(0.22, 1, 0.36, 1);
const COAT_DUR = 400;
const COAT_DELAYS = [0, 200, 400]; // palette[1], [2], [3]

// One full-plate colour coat — grows from the centre and fully covers the plate,
// completely overwriting the coat beneath it. Same final size for every coat.
function Coat({ color, size, delay, animate }) {
  const sc = useSharedValue(animate ? 0 : 1);
  useEffect(() => {
    if (animate) sc.value = withDelay(delay, withTiming(1, { duration: COAT_DUR, easing: QUINT }));
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));
  return (
    <Animated.View
      style={[
        { position: 'absolute', left: 0, top: 0, width: size, height: size, borderRadius: size / 2, backgroundColor: color },
        style,
      ]}
    />
  );
}

// The dish illustration — a composition of flat ingredient discs. Fades in once
// the plate has been painted through the colour story.
function Illustration({ blobs, size, animate }) {
  const o = useSharedValue(animate ? 0 : 1);
  useEffect(() => {
    if (animate) o.value = withDelay(800, withTiming(1, { duration: 300, easing: Easing.out(Easing.quad) }));
  }, []);
  const style = useAnimatedStyle(() => ({ opacity: o.value }));
  return (
    <Animated.View style={[{ position: 'absolute', left: 0, top: 0, width: size, height: size }, style]}>
      {blobs.map((b, i) => {
        const d = (b.s / 100) * size;
        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: (b.x / 100) * size - d / 2,
              top: (b.y / 100) * size - d / 2,
              width: d,
              height: d,
              borderRadius: d / 2,
              backgroundColor: b.c,
            }}
          />
        );
      })}
    </Animated.View>
  );
}

// The dish plate. With `reveal` it paints itself: empty plate → flashes through
// palette[1] → [2] → [3] (each a full-plate coat, staggered), then the dish
// illustration fades in on top. Every coat ends the same size — no bullseye.
export function DishVessel({ dish, size = 220, showSteam = true, reveal = false, style }) {
  if (!dish) return null;
  const colors = dish.reveal && dish.reveal.length >= 4 ? dish.reveal : ['#efe2c4', '#d8a637', '#c44a25', '#3a2418'];
  const blobs = dish.blobs || [];

  return (
    <View style={[{ width: size, height: size }, style]}>
      {/* the plate — circular clip; starts on the lightest tone when revealing */}
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          overflow: 'hidden',
          backgroundColor: reveal ? colors[0] : colors[3],
        }}
      >
        {reveal ? (
          <>
            <Coat color={colors[1]} size={size} delay={COAT_DELAYS[0]} animate />
            <Coat color={colors[2]} size={size} delay={COAT_DELAYS[1]} animate />
            <Coat color={colors[3]} size={size} delay={COAT_DELAYS[2]} animate />
          </>
        ) : null}
        <Illustration blobs={blobs} size={size} animate={reveal} />
        {/* flat hairline rim */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute', left: 0, top: 0, right: 0, bottom: 0,
            borderRadius: size / 2, borderWidth: 1, borderColor: 'rgba(20,20,15,0.10)',
          }}
        />
      </View>
      {dish.steam && showSteam ? <Steam rise={size * 0.7} /> : null}
    </View>
  );
}
