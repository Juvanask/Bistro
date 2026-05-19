import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack, usePathname, useRouter } from 'expo-router';
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts as useSerif,
  InstrumentSerif_400Regular,
  InstrumentSerif_400Regular_Italic,
} from '@expo-google-fonts/instrument-serif';
import { useFonts as useGeist, Geist_400Regular, Geist_500Medium, Geist_600SemiBold } from '@expo-google-fonts/geist';
import { useFonts as useMono, JetBrainsMono_400Regular, JetBrainsMono_500Medium } from '@expo-google-fonts/jetbrains-mono';

import { useThemeStore } from '../store/themeStore';
import { useCartStore } from '../store/cartStore';
import { useChatStore } from '../store/chatStore';
import { useUiStore } from '../store/uiStore';
import { AppBackground } from '../components/AppBackground';
import { TabBar } from '../components/TabBar';
import { Toast } from '../components/Toast';
import { VoiceModal } from '../components/VoiceModal';

SplashScreen.preventAutoHideAsync().catch(() => {});

// Transparent navigator — lets the AppBackground (grain + warm washes) show
// through every screen instead of the navigator's default opaque grey.
const NAV_THEME = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: 'transparent' },
};

function Overlays() {
  const t = useThemeStore((s) => s.theme);
  const path = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const toasts = useUiStore((s) => s.toasts);
  const voiceOpen = useUiStore((s) => s.voiceOpen);
  const setVoiceOpen = useUiStore((s) => s.setVoiceOpen);
  const send = useChatStore((s) => s.send);

  const isWelcome = path === '/' || path === '/index';
  const isCheckout = path.startsWith('/checkout');
  const isChat = path.startsWith('/chat');

  const showTab = !isWelcome && !isCheckout;
  const showToasts = !isChat;

  return (
    <>
      {showToasts && toasts.length ? (
        <View style={{ position: 'absolute', top: insets.top + 8, left: 16, right: 16, gap: 8, zIndex: 150 }} pointerEvents="box-none">
          {toasts.map((t2) => <Toast key={t2.id} text={t2.text} />)}
        </View>
      ) : null}

      {showTab ? <TabBar /> : null}

      <VoiceModal
        open={voiceOpen}
        onClose={() => setVoiceOpen(false)}
        onSubmit={(text) => {
          // take the diner into the chat, then hand the transcript to Léa
          if (!path.startsWith('/chat')) router.push('/chat');
          setTimeout(() => send(text), 280);
        }}
      />
    </>
  );
}

export default function RootLayout() {
  const [serif] = useSerif({ InstrumentSerif_400Regular, InstrumentSerif_400Regular_Italic });
  const [geist] = useGeist({ Geist_400Regular, Geist_500Medium, Geist_600SemiBold });
  const [mono] = useMono({ JetBrainsMono_400Regular, JetBrainsMono_500Medium });

  const t = useThemeStore((s) => s.theme);
  const hydrateTheme = useThemeStore((s) => s.hydrate);
  const hydrateCart = useCartStore((s) => s.hydrate);

  useEffect(() => {
    // theme + cart persist across restarts; the chat is intentionally session-only
    hydrateTheme();
    hydrateCart();
  }, []);

  const ready = serif && geist && mono;
  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: t.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={t.lea2} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style={t.dark ? 'light' : 'dark'} />
        <View style={{ flex: 1 }}>
          <AppBackground />
          <ThemeProvider value={NAV_THEME}>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: 'transparent' },
                animation: 'fade',
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="home" />
              <Stack.Screen name="menu" />
              <Stack.Screen name="chat" />
              <Stack.Screen name="cart" />
              <Stack.Screen name="checkout" options={{ animation: 'slide_from_bottom' }} />
              <Stack.Screen name="item/[id]" />
            </Stack>
          </ThemeProvider>
          <Overlays />
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
