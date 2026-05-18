import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../lib/api';
import { useCartStore } from './cartStore';

const KEY = '@bistro/chat';
const uid = () => 'M' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

function greeting() {
  const h = new Date().getHours();
  const part = h < 5 ? 'Late one' : h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening';
  return `${part}. Kitchen's warm — what are we eating?`;
}

const seed = () => [
  { id: uid(), type: 'lea', text: greeting() },
  { id: uid(), type: 'chips', chips: ['the usual', 'something spicier', 'lighter please', 'surprise me'] },
];

export const useChatStore = create((set, get) => ({
  messages: seed(),
  pending: false,
  context: { last_item_ref: null },

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        set({ messages: d.messages?.length ? d.messages : seed(), context: d.context || { last_item_ref: null } });
      }
    } catch {}
  },

  reset: () => {
    set({ messages: seed(), context: { last_item_ref: null }, pending: false });
    AsyncStorage.removeItem(KEY);
  },

  _save: () => AsyncStorage.setItem(KEY, JSON.stringify({ messages: get().messages, context: get().context })),

  _push: (m) => {
    set((s) => ({ messages: [...s.messages, { id: uid(), ...m }] }));
    get()._save();
  },

  send: async (text) => {
    const trimmed = (text || '').trim();
    if (!trimmed || get().pending) return;
    get()._push({ type: 'user', text: trimmed });
    set({ pending: true });

    const cart = useCartStore.getState();
    const lines = cart.lines.map((l) => ({ line_id: l.id, item_id: l.item_id, qty: l.qty, modifiers: l.modifiers }));
    const history = get().messages
      .filter((m) => (m.type === 'lea' || m.type === 'user') && m.text)
      .map((m) => ({ role: m.type === 'user' ? 'user' : 'assistant', content: m.text }));

    try {
      const res = await api.chat({
        messages: history,
        cart: lines,
        context: { last_item_ref: cart.lastItemRef || get().context.last_item_ref },
      });

      const actions = res.actions || [];
      const adds = actions.filter((a) => a.type === 'add');
      const suggests = actions.filter((a) => a.type === 'suggest');

      // reply bubble first
      get()._push({ type: 'lea', text: res.reply || '…' });

      // apply non-add actions immediately
      const cs = useCartStore.getState();
      for (const a of actions) {
        if (a.type === 'clear') cs.clear();
        else if (a.type === 'remove') {
          if (a.line_id) cs.remove(a.line_id);
          else if (a.item_id) cs.removeByItemId(a.item_id);
        } else if (a.type === 'modify') {
          const lineId = a.line_id === '<last>' ? useCartStore.getState().lastLineId : a.line_id;
          if (lineId) cs.modify(lineId, a.modifiers || {});
        }
      }

      // staggered adds — items land on the table one after another
      adds.forEach((a, i) => {
        setTimeout(() => {
          useCartStore.getState().add(a.item_id, a.qty || 1, a.modifiers || {}, { addedBy: 'lea' });
        }, 260 + i * 300);
      });

      // suggestion cards + follow-up chips
      if (suggests.length) {
        suggests.forEach((a, i) => {
          setTimeout(() => get()._push({ type: 'card', dishId: a.item_id }), 220 + i * 220);
        });
        setTimeout(() => {
          get()._push({ type: 'chips', chips: ['something spicier', 'lighter please', 'pair with wine', 'surprise me'] });
        }, 240 + suggests.length * 220);
      }

      if (res.context?.last_item_ref) {
        set({ context: { last_item_ref: res.context.last_item_ref } });
        useCartStore.getState().setLastItemRef(res.context.last_item_ref);
      }
      get()._save();
    } catch (e) {
      get()._push({ type: 'lea', text: 'Lost you for a second there — the line dropped. Say that again?' });
    } finally {
      set({ pending: false });
    }
  },
}));
