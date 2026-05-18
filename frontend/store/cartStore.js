import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { findItem } from '../constants/menu';

const KEY = '@bistro/cart';
const uid = () => 'L' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

function unitPrice(item, modifiers) {
  let p = item.price;
  const sizeMod = item.modifiers?.find((m) => m.name === 'size');
  if (sizeMod && modifiers?.size && sizeMod.priceDelta) p += sizeMod.priceDelta[modifiers.size] || 0;
  if (modifiers?.addons?.length) {
    const addonMod = item.modifiers?.find((m) => m.name === 'addons');
    for (const a of modifiers.addons) {
      const opt = addonMod?.options?.find((o) => o.name === a);
      if (opt) p += opt.price;
    }
  }
  return p;
}

function summarize(item, modifiers) {
  const bits = [];
  if (modifiers?.spice) bits.push(modifiers.spice.toLowerCase());
  if (modifiers?.size) bits.push(modifiers.size.toLowerCase());
  if (modifiers?.doneness) bits.push(modifiers.doneness.toLowerCase());
  if (modifiers?.addons?.length) bits.push('+ ' + modifiers.addons.join(', '));
  if (modifiers?.note) bits.push('“' + modifiers.note + '”');
  return bits.join(' · ') || item.tagline;
}

const persist = (s) =>
  AsyncStorage.setItem(KEY, JSON.stringify({ lines: s.lines, lastLineId: s.lastLineId, lastItemRef: s.lastItemRef }));

export const useCartStore = create((set, get) => ({
  lines: [],
  lastLineId: null,
  lastItemRef: null,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        set({ lines: (d.lines || []).map((l) => ({ ...l, justAdded: false })), lastLineId: d.lastLineId || null, lastItemRef: d.lastItemRef || null });
      }
    } catch {}
  },

  // add — merges into an existing line when item + modifiers match.
  add: (item_id, qty = 1, modifiers = {}, opts = {}) => {
    const item = findItem(item_id);
    if (!item) return null;
    const addedBy = opts.addedBy || 'user';
    const modKey = JSON.stringify(modifiers || {});
    let lineId = null;

    set((s) => {
      const idx = s.lines.findIndex((l) => l.item_id === item_id && JSON.stringify(l.modifiers || {}) === modKey);
      let lines;
      if (idx >= 0) {
        lineId = s.lines[idx].id;
        lines = s.lines.map((l, i) =>
          i === idx ? { ...l, qty: l.qty + qty, justAdded: true, addedBy: l.addedBy === 'lea' ? 'lea' : addedBy } : l
        );
      } else {
        lineId = uid();
        lines = [...s.lines, { id: lineId, item_id, qty, modifiers, addedBy, justAdded: true }];
      }
      return { lines, lastLineId: lineId, lastItemRef: item.name };
    });
    persist(get());
    setTimeout(() => {
      set((s) => ({ lines: s.lines.map((l) => ({ ...l, justAdded: false })) }));
    }, 700);
    return lineId;
  },

  remove: (line_id) => { set((s) => ({ lines: s.lines.filter((l) => l.id !== line_id) })); persist(get()); },

  removeByItemId: (item_id) => {
    set((s) => {
      const rev = [...s.lines].reverse().findIndex((l) => l.item_id === item_id);
      if (rev < 0) return s;
      const idx = s.lines.length - 1 - rev;
      const lines = [...s.lines];
      lines.splice(idx, 1);
      return { lines };
    });
    persist(get());
  },

  setQuantity: (line_id, qty) => {
    set((s) => ({
      lines: qty <= 0
        ? s.lines.filter((l) => l.id !== line_id)
        : s.lines.map((l) => (l.id === line_id ? { ...l, qty } : l)),
    }));
    persist(get());
  },

  modify: (line_id, modifiers) => {
    set((s) => ({ lines: s.lines.map((l) => (l.id === line_id ? { ...l, modifiers: { ...l.modifiers, ...modifiers } } : l)) }));
    persist(get());
  },

  clear: () => { set({ lines: [], lastLineId: null, lastItemRef: null }); persist(get()); },

  setLastItemRef: (ref) => { set({ lastItemRef: ref }); persist(get()); },

  count: () => get().lines.reduce((s, l) => s + l.qty, 0),
  subtotal: () =>
    get().lines.reduce((s, l) => {
      const item = findItem(l.item_id);
      return item ? s + unitPrice(item, l.modifiers) * l.qty : s;
    }, 0),
  describeLine: (line) => {
    const item = findItem(line.item_id);
    if (!item) return null;
    const u = unitPrice(item, line.modifiers);
    return { name: item.name, sub: summarize(item, line.modifiers), unit: u, total: u * line.qty, item };
  },
}));
