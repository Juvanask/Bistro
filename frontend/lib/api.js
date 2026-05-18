const BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';

async function jsonFetch(path, opts = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (!res.ok) throw new Error(`${path} → ${res.status}`);
  return res.json();
}

export const api = {
  menu: () => jsonFetch('/api/menu'),
  chat: ({ messages, cart, context }) =>
    jsonFetch('/api/chat', { method: 'POST', body: JSON.stringify({ messages, cart, context }) }),
  order: ({ cart, tip_pct = 20, table = 14 }) =>
    jsonFetch('/api/order', { method: 'POST', body: JSON.stringify({ cart, tip_pct, table }) }),
};
