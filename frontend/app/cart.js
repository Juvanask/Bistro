import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Glass } from '../components/Glass';
import { LeaOrb } from '../components/LeaOrb';
import { DishVessel } from '../components/DishVessel';
import { Display, Body, Eyebrow, Price, Btn } from '../components/atoms';
import { Plus, Minus } from '../components/Icons';
import { findItem } from '../constants/menu';
import { useThemeStore } from '../store/themeStore';
import { useCartStore } from '../store/cartStore';
import { FONTS, RADIUS } from '../constants/theme';
import { tap } from '../lib/haptics';

export default function Cart() {
  const t = useThemeStore((s) => s.theme);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const lines = useCartStore((s) => s.lines);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);
  const describeLine = useCartStore((s) => s.describeLine);

  const subtotal = lines.reduce((sum, l) => {
    const d = describeLine(l);
    return d ? sum + d.total : sum;
  }, 0);
  const tax = subtotal * 0.085;
  const total = subtotal + tax;

  if (lines.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <LeaOrb size={66} state="idle" halo />
        <Display size={32} style={{ marginTop: 28 }}>Empty plate.</Display>
        <Body size={14} color={t.inkSoft} style={{ textAlign: 'center', lineHeight: 21, marginTop: 10, maxWidth: 250 }}>
          Tell Léa what you’re craving, or browse the kitchen and add a few things.
        </Body>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 24 }}>
          <Btn kind="lea" onPress={() => router.replace('/chat')} style={{ paddingHorizontal: 22 }}>Ask Léa</Btn>
          <Btn kind="ghost" onPress={() => router.replace('/menu')} style={{ paddingHorizontal: 22 }}>Browse</Btn>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 180 }}>
        <SafeAreaView edges={['top']}>
          <View style={{ paddingHorizontal: 20, paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <View>
              <Eyebrow style={{ marginBottom: 8 }}>Cart · Table 12</Eyebrow>
              <Display size={34}>Tonight’s table.</Display>
            </View>
            <Pressable onPress={() => { tap(); clear(); }} hitSlop={8} style={({ pressed }) => ({ paddingBottom: 6, opacity: pressed ? 0.5 : 1 })}>
              <Body size={13} color={t.inkFaint}>Empty cart</Body>
            </Pressable>
          </View>
        </SafeAreaView>

        <View style={{ paddingHorizontal: 20, paddingTop: 16, gap: 10 }}>
          {lines.map((l, i) => {
            const d = describeLine(l);
            const dish = findItem(l.item_id);
            if (!d || !dish) return null;
            return (
              <Animated.View key={l.id} entering={FadeInUp.delay(i * 50).duration(400)}>
                <Glass radius={RADIUS.md} style={{ padding: 14, flexDirection: 'row', gap: 12 }}>
                  <DishVessel dish={dish} size={54} showSteam={false} />
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                      <Display size={18} numberOfLines={1} style={{ flex: 1 }}>{d.name}</Display>
                      <Price value={d.total} size={13} />
                    </View>
                    <Eyebrow style={{ fontSize: 9, marginTop: 2 }}>{d.sub}</Eyebrow>
                    {l.addedBy === 'lea' ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 }}>
                        <LeaOrb size={12} state="idle" />
                        <Body size={9} color={t.lea3} style={{ fontFamily: FONTS.monoMed, letterSpacing: 0.8, textTransform: 'uppercase' }}>
                          Added by Léa
                        </Body>
                      </View>
                    ) : null}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 9 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: t.hairline2, borderRadius: RADIUS.full, padding: 2 }}>
                        <Step icon={Minus} onPress={() => setQuantity(l.id, l.qty - 1)} t={t} />
                        <Body size={13} style={{ minWidth: 18, textAlign: 'center', fontFamily: FONTS.monoMed }}>{l.qty}</Body>
                        <Step icon={Plus} onPress={() => setQuantity(l.id, l.qty + 1)} t={t} />
                      </View>
                      <Pressable onPress={() => { tap(); remove(l.id); }} hitSlop={6}>
                        <Body size={12} color={t.inkFaint}>Remove</Body>
                      </Pressable>
                    </View>
                  </View>
                </Glass>
              </Animated.View>
            );
          })}
        </View>

        {/* totals */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
          <Glass strong style={{ padding: 16, gap: 8 }}>
            <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} t={t} />
            <Row label="Tax (8.5%)" value={`$${tax.toFixed(2)}`} t={t} />
            <View style={{ height: 0.5, backgroundColor: t.hairline, marginVertical: 4 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Display size={22}>Total</Display>
              <Price value={total} size={22} />
            </View>
          </Glass>
        </View>
      </ScrollView>

      <View style={{ position: 'absolute', left: 16, right: 16, bottom: insets.bottom + 92 }}>
        <Btn kind="lea" height={56} onPress={() => router.push('/checkout')}>
          {`Send to kitchen · $${total.toFixed(2)}`}
        </Btn>
      </View>
    </View>
  );
}

function Step({ icon: Icon, onPress, t }) {
  return (
    <Pressable
      onPress={() => { tap(); onPress(); }}
      style={({ pressed }) => ({ width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.5 : 1 })}
    >
      <Icon size={14} color={t.ink} />
    </Pressable>
  );
}

function Row({ label, value, t }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Body size={13} color={t.inkSoft}>{label}</Body>
      <Body size={13} color={t.inkSoft} style={{ fontFamily: FONTS.monoMed }}>{value}</Body>
    </View>
  );
}
