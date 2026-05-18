import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Glass } from './Glass';
import { Home, MenuList, Cart } from './Icons';
import { LeaOrb } from './LeaOrb';
import { useThemeStore } from '../store/themeStore';
import { useCartStore } from '../store/cartStore';
import { FONTS, RADIUS } from '../constants/theme';
import { tap } from '../lib/haptics';
import { withAlpha } from '../lib/color';

const TABS = [
  { id: 'home', route: '/home', Icon: Home },
  { id: 'menu', route: '/menu', Icon: MenuList },
  { id: 'cart', route: '/cart', Icon: Cart, badge: true },
  { id: 'lea', route: '/chat', lea: true },
];

// Floating glass tab bar. The Léa tab expands + ember-fills when active.
export function TabBar() {
  const t = useThemeStore((s) => s.theme);
  const router = useRouter();
  const path = usePathname();
  const count = useCartStore((s) => s.lines.reduce((a, l) => a + l.qty, 0));

  const activeId =
    path.startsWith('/menu') || path.startsWith('/item') ? 'menu'
      : path.startsWith('/cart') || path.startsWith('/checkout') ? 'cart'
      : path.startsWith('/chat') ? 'lea'
      : 'home';

  return (
    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, alignItems: 'center', paddingBottom: 26 }} pointerEvents="box-none">
      <Glass strong radius={RADIUS.full} style={{ flexDirection: 'row', gap: 4, padding: 6 }}>
        {TABS.map((tab) => {
          const active = tab.id === activeId;
          return (
            <Pressable
              key={tab.id}
              onPress={() => { tap(); router.replace(tab.route); }}
              style={{
                height: 44,
                width: active && tab.lea ? 86 : 56,
                borderRadius: RADIUS.full,
                alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6,
                backgroundColor: active && !tab.lea ? withAlpha(t.ink, 0.07) : 'transparent',
                overflow: 'hidden',
              }}
            >
              {active && tab.lea ? (
                <LinearGradient
                  colors={[t.lea1, t.lea2]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                />
              ) : null}

              {tab.lea ? (
                <LeaOrb size={20} state="idle" />
              ) : (
                <View>
                  <tab.Icon size={20} color={active ? t.ink : t.inkFaint} />
                  {tab.badge && count > 0 ? (
                    <View style={{
                      position: 'absolute', top: -5, right: -8,
                      minWidth: 16, height: 16, paddingHorizontal: 4, borderRadius: 8,
                      backgroundColor: t.tomato, alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Text style={{ color: '#fff', fontFamily: FONTS.bodyBold, fontSize: 9 }}>{count}</Text>
                    </View>
                  ) : null}
                </View>
              )}
              {active && tab.lea ? (
                <Text style={{ color: '#fff', fontFamily: FONTS.bodyBold, fontSize: 12 }}>Léa</Text>
              ) : null}
            </Pressable>
          );
        })}
      </Glass>
    </View>
  );
}
