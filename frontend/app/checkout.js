import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { Glass } from '../components/Glass';
import { LeaOrb } from '../components/LeaOrb';
import { NavBar } from '../components/NavBar';
import { Display, Body, Eyebrow, Price, Btn } from '../components/atoms';
import { Chip } from '../components/Chip';
import { useThemeStore } from '../store/themeStore';
import { useCartStore } from '../store/cartStore';
import { useUiStore } from '../store/uiStore';
import { api } from '../lib/api';
import { FONTS } from '../constants/theme';
import { success } from '../lib/haptics';

export default function Checkout() {
  const t = useThemeStore((s) => s.theme);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const lines = useCartStore((s) => s.lines);
  const describeLine = useCartStore((s) => s.describeLine);
  const clear = useCartStore((s) => s.clear);
  const pushToast = useUiStore((s) => s.pushToast);

  const [order, setOrder] = useState(null);
  const plates = lines.reduce((a, l) => a + l.qty, 0);

  useEffect(() => {
    let alive = true;
    const cart = lines.map((l) => ({ line_id: l.id, item_id: l.item_id, qty: l.qty, modifiers: l.modifiers }));
    const started = Date.now();
    api.order({ cart, tip_pct: 0 })
      .then((res) => {
        const wait = Math.max(0, 1600 - (Date.now() - started));
        setTimeout(() => { if (alive) { success(); setOrder(res); } }, wait);
      })
      .catch(() => {
        const subtotal = lines.reduce((s, l) => { const d = describeLine(l); return d ? s + d.total : s; }, 0);
        const tax = +(subtotal * 0.085).toFixed(2);
        setTimeout(() => {
          if (!alive) return;
          success();
          setOrder({
            order_id: 'B-' + Math.floor(1000 + Math.random() * 9000),
            eta_minutes: 18 + lines.length * 3,
            subtotal: +subtotal.toFixed(2), tax, total: +(subtotal + tax).toFixed(2),
            lines: lines.map((l) => { const d = describeLine(l); return { qty: l.qty, name: d?.name, line_total: d?.total || 0 }; }),
          });
        }, 1600);
      });
    return () => { alive = false; };
  }, []);

  const done = () => {
    clear();
    router.replace('/home');
    pushToast('Order’s on the pass. Léa will check in shortly.');
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView edges={['top']}>
        <NavBar onBack={() => router.back()} title="Confirming" />
      </SafeAreaView>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        <View style={{ alignItems: 'center', paddingTop: 18 }}>
          <LeaOrb size={92} state={order ? 'idle' : 'thinking'} halo />
          <Display size={32} style={{ textAlign: 'center', marginTop: 24 }}>
            {order ? 'Cooking now.' : 'Sending to the pass…'}
          </Display>
          {order ? (
            <Animated.View entering={FadeIn.duration(400)}>
              <Body size={15} color={t.inkSoft} style={{ textAlign: 'center', lineHeight: 23, marginTop: 10, maxWidth: 300 }}>
                Chef nodded. {plates} {plates === 1 ? 'plate' : 'plates'} landing in about {order.eta_minutes} minutes — I’ll bring water in the meantime.
              </Body>
            </Animated.View>
          ) : (
            <Body size={15} color={t.inkSoft} style={{ textAlign: 'center', marginTop: 10 }}>
              Walking your ticket to the kitchen.
            </Body>
          )}
        </View>

        {order ? (
          <Animated.View entering={FadeInUp.delay(150).duration(450)} style={{ paddingHorizontal: 20, marginTop: 24 }}>
            <Glass strong style={{ padding: 18, gap: 10 }}>
              <Eyebrow>Order #{order.order_id} · ETA {order.eta_minutes} min</Eyebrow>
              {order.lines.map((l, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Body size={11} color={t.inkFaint} style={{ fontFamily: FONTS.monoMed, minWidth: 20 }}>{l.qty}×</Body>
                  <Body size={14} style={{ flex: 1 }} numberOfLines={1}>{l.name}</Body>
                  <Body size={12} style={{ fontFamily: FONTS.monoMed }}>${(l.line_total || 0).toFixed(2)}</Body>
                </View>
              ))}
              <View style={{ height: 0.5, backgroundColor: t.hairline, marginVertical: 4 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Display size={18}>Total charged</Display>
                <Price value={order.total} size={18} />
              </View>
            </Glass>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 16 }}>
              <Chip lea dotted onPress={() => pushToast('Léa noted it — wine on the way.')}>Add wine pairing</Chip>
              <Chip lea dotted onPress={() => pushToast('Saved as your usual.')}>Save this order</Chip>
            </View>
          </Animated.View>
        ) : null}
      </ScrollView>

      {order ? (
        <View style={{ position: 'absolute', left: 16, right: 16, bottom: insets.bottom + 16 }}>
          <Btn kind="primary" height={54} onPress={done}>Done</Btn>
        </View>
      ) : null}
    </View>
  );
}
