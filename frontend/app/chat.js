import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useOpenDish } from '../lib/useOpenDish';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Glass } from '../components/Glass';
import { LeaOrb } from '../components/LeaOrb';
import { Bubble, TypingBubble, SystemBubble } from '../components/ChatBubble';
import { DishCard } from '../components/DishCard';
import { Chip } from '../components/Chip';
import { Body } from '../components/atoms';
import { Mic, Send } from '../components/Icons';
import { findItem } from '../constants/menu';
import { useThemeStore } from '../store/themeStore';
import { useChatStore } from '../store/chatStore';
import { useCartStore } from '../store/cartStore';
import { useUiStore } from '../store/uiStore';
import { addDish } from '../lib/dishActions';
import { FONTS, RADIUS } from '../constants/theme';
import { tap } from '../lib/haptics';

export default function Chat() {
  const t = useThemeStore((s) => s.theme);
  const openDish = useOpenDish();
  const insets = useSafeAreaInsets();
  const messages = useChatStore((s) => s.messages);
  const pending = useChatStore((s) => s.pending);
  const send = useChatStore((s) => s.send);
  const count = useCartStore((s) => s.lines.reduce((a, l) => a + l.qty, 0));
  const setVoiceOpen = useUiStore((s) => s.setVoiceOpen);

  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    const id = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 60);
    return () => clearTimeout(id);
  }, [messages.length, pending]);

  const submit = (override) => {
    const text = (override ?? input).trim();
    if (!text) return;
    setInput('');
    send(text);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* header */}
      <SafeAreaView edges={['top']}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 18, paddingVertical: 8 }}>
          <LeaOrb size={42} state={pending ? 'thinking' : 'idle'} halo />
          <View style={{ flex: 1 }}>
            <Body size={16} weight="600">Léa</Body>
            <Body size={12} color={t.inkFaint} style={{ marginTop: 2 }}>
              {pending ? 'thinking…' : `Bistro · ${count} in cart`}
            </Body>
          </View>
        </View>
      </SafeAreaView>

      {/* messages */}
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 20, gap: 10 }}
      >
        {messages.map((m) => {
          if (m.type === 'lea') return <Bubble key={m.id} from="lea">{m.text}</Bubble>;
          if (m.type === 'user') return <Bubble key={m.id} from="user">{m.text}</Bubble>;
          if (m.type === 'system') return <SystemBubble key={m.id}>{m.text}</SystemBubble>;
          if (m.type === 'card') {
            const d = findItem(m.dishId);
            if (!d) return null;
            return (
              <View key={m.id} style={{ alignSelf: 'flex-start', maxWidth: '88%' }}>
                <DishCard dish={d} compact onPress={(e) => openDish(d, e)} onAdd={() => addDish(d.id, { addedBy: 'lea' })} />
              </View>
            );
          }
          if (m.type === 'chips') {
            return (
              <View key={m.id} style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignSelf: 'flex-start', maxWidth: '92%' }}>
                {m.chips.map((c, j) => <Chip key={j} lea dotted onPress={() => submit(c)}>{c}</Chip>)}
              </View>
            );
          }
          return null;
        })}
        {pending ? <TypingBubble /> : null}
      </ScrollView>

      {/* composer */}
      <View style={{ paddingHorizontal: 14, paddingTop: 6, paddingBottom: insets.bottom + 96 }}>
        <Glass strong radius={RADIUS.full} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, padding: 6 }}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Tell Léa what you want…"
            placeholderTextColor={t.inkFaint}
            style={{ flex: 1, paddingHorizontal: 14, paddingVertical: 10, fontFamily: FONTS.body, fontSize: 15, color: t.ink }}
            returnKeyType="send"
            onSubmitEditing={() => submit()}
          />
          <Pressable
            onPress={() => { tap(); setVoiceOpen(true); }}
            style={{ width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' }}
          >
            <Mic size={18} color={t.inkSoft} />
          </Pressable>
          <Pressable onPress={() => submit()} disabled={!input.trim()}>
            {input.trim() ? (
              <LinearGradient
                colors={[t.lea1, t.lea3]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={{ width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' }}
              >
                <Send size={16} color="#fff" />
              </LinearGradient>
            ) : (
              <View style={{ width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: t.hairline }}>
                <Send size={16} color={t.inkFaint} />
              </View>
            )}
          </Pressable>
        </Glass>
      </View>
    </KeyboardAvoidingView>
  );
}
