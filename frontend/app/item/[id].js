import React, { useMemo, useState } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue, useAnimatedScrollHandler, useAnimatedStyle, FadeInUp,
} from 'react-native-reanimated';
import { Glass } from '../../components/Glass';
import { DishVessel } from '../../components/DishVessel';
import { HeroAmbient } from '../../components/HeroAmbient';
import { NavBar } from '../../components/NavBar';
import { Display, Body, Eyebrow, Price, Btn } from '../../components/atoms';
import { HeatDots } from '../../components/HeatDots';
import { IngredientDots } from '../../components/IngredientDots';
import { Check } from '../../components/Icons';
import { findItem } from '../../constants/menu';
import { useThemeStore } from '../../store/themeStore';
import { addDish } from '../../lib/dishActions';
import { FONTS, RADIUS } from '../../constants/theme';
import { tap } from '../../lib/haptics';

const MOD_LABELS = { spice: 'Spice level', size: 'Size', doneness: 'Cooked to' };

export default function ItemScreen() {
  const { id } = useLocalSearchParams();
  const dish = useMemo(() => findItem(Number(id)), [id]);
  if (!dish) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Body>Dish not found.</Body>
      </SafeAreaView>
    );
  }
  return <ItemBody dish={dish} />;
}

function ItemBody({ dish }) {
  const t = useThemeStore((s) => s.theme);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const mods = dish.modifiers || [];
  const choiceMods = mods.filter((m) => m.name !== 'addons');
  const addonMod = mods.find((m) => m.name === 'addons');

  const [choices, setChoices] = useState(() => {
    const o = {};
    choiceMods.forEach((m) => { o[m.name] = m.default || m.options[0]; });
    return o;
  });
  const [addons, setAddons] = useState([]);
  const [note, setNote] = useState('');

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => { scrollY.value = e.contentOffset.y; });
  const ambientStyle = useAnimatedStyle(() => ({ transform: [{ translateY: -scrollY.value * 0.35 }] }));
  const vesselStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -scrollY.value * 0.22 }, { scale: 1 - Math.min(scrollY.value, 200) * 0.0006 }],
  }));

  // live price reflects size + add-on choices
  const sizeMod = mods.find((m) => m.name === 'size');
  let price = dish.price;
  if (sizeMod?.priceDelta && choices.size) price += sizeMod.priceDelta[choices.size] || 0;
  addons.forEach((a) => {
    const opt = addonMod?.options.find((o) => o.name === a);
    if (opt) price += opt.price;
  });

  const onAdd = () => {
    const modifiers = { ...choices };
    if (addons.length) modifiers.addons = addons;
    if (note.trim()) modifiers.note = note.trim();
    addDish(dish.id, { addedBy: 'user', modifiers });
  };

  const toggleAddon = (name) => {
    tap();
    setAddons((cur) => (cur.includes(name) ? cur.filter((x) => x !== name) : [...cur, name]));
  };

  return (
    <View style={{ flex: 1 }}>
      <Animated.View style={[{ position: 'absolute', top: 0, left: 0, right: 0, height: 460 }, ambientStyle]} pointerEvents="none">
        <HeroAmbient kind={dish.ambient} />
      </Animated.View>

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: insets.bottom + 180 }}
      >
        <SafeAreaView edges={['top']}>
          <NavBar onBack={() => router.back()} title={dish.cat.toUpperCase()} />
        </SafeAreaView>

        {/* the vessel plates itself — empty plate, then colours grow in from centre */}
        <Animated.View style={[{ alignItems: 'center', paddingTop: 6, paddingBottom: 14 }, vesselStyle]}>
          <DishVessel dish={dish} size={248} reveal />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(150).duration(340)} style={{ paddingHorizontal: 26, alignItems: 'center' }}>
          <Eyebrow style={{ marginBottom: 8 }}>{dish.tagline}</Eyebrow>
          <Display size={38} style={{ textAlign: 'center' }}>{dish.name}</Display>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12 }}>
            <Price value={dish.price} size={17} />
            {dish.heat > 0 ? (
              <>
                <Body size={13} color={t.inkFaint}>·</Body>
                <HeatDots level={dish.heat} />
              </>
            ) : null}
            <Body size={13} color={t.inkFaint}>·</Body>
            <Body size={13} color={t.inkSoft}>★ {dish.rating}</Body>
          </View>
          <Body size={15} color={t.inkSoft} style={{ textAlign: 'center', lineHeight: 23, marginTop: 16, maxWidth: 320 }}>
            {dish.blurb}
          </Body>
        </Animated.View>

        {/* color story */}
        <Animated.View entering={FadeInUp.delay(240).duration(340)} style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <Glass style={{ padding: 18 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <Eyebrow>Color story</Eyebrow>
              <Body size={10} color={t.inkFaint} style={{ fontFamily: FONTS.mono }}>
                {dish.palette.length} ingredients
              </Body>
            </View>
            <IngredientDots palette={dish.palette} labels={dish.paletteLabels} size="xl" showLabels />
          </Glass>
        </Animated.View>

        {/* make it yours — real modifiers + kitchen note */}
        <Animated.View entering={FadeInUp.delay(320).duration(340)} style={{ paddingHorizontal: 20, marginTop: 16 }}>
          <Glass style={{ padding: 18, gap: 20 }}>
            <Eyebrow>Make it yours</Eyebrow>

            {choiceMods.map((m) => (
              <View key={m.name} style={{ gap: 10 }}>
                <Body size={13} weight="600">{MOD_LABELS[m.name] || m.name}</Body>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {m.options.map((opt) => {
                    const on = choices[m.name] === opt;
                    return (
                      <Pressable
                        key={opt}
                        onPress={() => { tap(); setChoices((c) => ({ ...c, [m.name]: opt })); }}
                        style={{
                          paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.full,
                          borderWidth: 1,
                          borderColor: on ? t.ink : t.hairline,
                          backgroundColor: on ? t.ink : 'transparent',
                        }}
                      >
                        <Body size={13} weight="500" color={on ? t.bg : t.inkSoft}>{opt}</Body>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))}

            {addonMod ? (
              <View style={{ gap: 10 }}>
                <Body size={13} weight="600">Add-ons</Body>
                <View style={{ gap: 10 }}>
                  {addonMod.options.map((opt) => {
                    const on = addons.includes(opt.name);
                    return (
                      <Pressable key={opt.name} onPress={() => toggleAddon(opt.name)} style={{ flexDirection: 'row', alignItems: 'center', gap: 11 }}>
                        <View style={{
                          width: 20, height: 20, borderRadius: 6,
                          borderWidth: 1.5, borderColor: on ? t.ink : t.hairline,
                          backgroundColor: on ? t.ink : 'transparent',
                          alignItems: 'center', justifyContent: 'center',
                        }}>
                          {on ? <Check size={12} color={t.bg} /> : null}
                        </View>
                        <Body size={14} style={{ flex: 1 }}>{opt.name}</Body>
                        <Body size={12} color={t.inkFaint} style={{ fontFamily: FONTS.mono }}>
                          {opt.price > 0 ? `+ $${opt.price.toFixed(2)}` : 'free'}
                        </Body>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ) : null}

            {/* kitchen note */}
            <View style={{ gap: 10 }}>
              <Body size={13} weight="600">Note for the kitchen</Body>
              <View style={{ borderWidth: 1, borderColor: t.hairline, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 }}>
                <TextInput
                  value={note}
                  onChangeText={setNote}
                  placeholder="No onions, extra crisp, allergy…"
                  placeholderTextColor={t.inkMute}
                  multiline
                  style={{ fontFamily: FONTS.body, fontSize: 14, color: t.ink, minHeight: 36 }}
                />
              </View>
            </View>
          </Glass>
        </Animated.View>
      </Animated.ScrollView>

      {/* sticky add — carries the dish's deep palette colours */}
      <View style={{ position: 'absolute', left: 16, right: 16, bottom: insets.bottom + 92 }}>
        <Btn kind="lea" height={56} onPress={onAdd} gradient={[dish.reveal[2], dish.reveal[3]]}>
          {`Add · $${price.toFixed(2)}`}
        </Btn>
      </View>
    </View>
  );
}
