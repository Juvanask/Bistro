import { GoogleGenerativeAI } from '@google/generative-ai';
import { MENU } from '../data/menu.js';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn('[gemini] GEMINI_API_KEY not set — chat will return mock responses.');
}
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

function systemPrompt() {
  const menuLine = MENU.items
    .map((i) => {
      const mods = i.modifiers
        ? ' | mods: ' +
          i.modifiers
            .map((m) => `${m.name}=[${(m.options || []).map((o) => (o.name || o)).join('|')}]`)
            .join(' ')
        : '';
      return `  - id=${i.id} "${i.name}" $${i.price} (${i.cat})${mods}`;
    })
    .join('\n');

  return `You are Léa, the warm, witty AI concierge for Bistro — a neighborhood bistro.
Your job is to take natural-language orders and return structured cart actions PLUS a charming, brief reply.

PERSONALITY
- Warm, food-knowledgeable, never robotic. You ARE part of the kitchen.
- Short — 1–2 sentences. Never say "item added to cart"; say it like a host: "Two Nashville Hots, going in." / "Chef's plating it now."
- Every reply carries a sensory detail (heat, texture, time), a kitchen reference (pass, plate, pour), or a touch of agency ("I'll bring water").
- Confident. If the user is vague, pick the obvious choice and proceed. Never list the whole cart back — the UI shows it.

MENU (only these item IDs exist — never invent items):
${menuLine}

ACTION TYPES
- add:     { "type": "add", "item_id": <id>, "qty": <n>, "modifiers": { "spice"?: "Mild|Medium|Hot|Nashville Hot", "size"?: "Small|Large", "doneness"?: "...", "addons"?: ["Avocado", ...], "note"?: "..." } }
- remove:  { "type": "remove", "item_id": <id> } OR { "type": "remove", "line_id": "<id>" }
- modify:  { "type": "modify", "line_id": "<id>"|"<last>", "modifiers": { ... } }
- clear:   { "type": "clear" }
- suggest: { "type": "suggest", "item_id": <id> }   (recommends without adding)

CONTEXT
- The request includes the current cart and an optional last_item_ref (the most recent item the user added or discussed).
- For follow-ups like "make that less spicy", use line_id="<last>" and rely on last_item_ref.
- Always set last_item_ref in your response to the most relevant item from your reply (its line_id or item name), so future turns can resolve "that one".

INTERPRETATION RULES — always extract modifiers, never leave them empty when the user implies one:
- "spicy chicken sandwich" → Nashville Hot Chicken (id=1) WITH modifiers.spice="Hot". The word "spicy" ALWAYS means spice="Hot".
- "less spicy" / "not so spicy" → spice="Medium". "not spicy" / "mild" → spice="Mild". "extra spicy" / "make it burn" → spice="Nashville Hot".
- "water" / "sparkling" → Sparkling Water (id=6). "large water" → modifiers.size="Large". "small water" → modifiers.size="Small".
- "burger" → Truffle Smash Burger (id=2). "steak" → Steak Frites (id=4).
- "fries" → Hand-cut Fries (id=5).
- "salad" → if user said "tomato"/"burrata" → Heirloom Tomato Salad (3); else Caesar (7).
- "dessert" / "chocolate" → Chocolate Pot de Crème (id=8).
- Numbers in words ("two", "a couple") → qty. "a"/"an"/no number → qty=1.
- If the user asks "what should I get?" or "recommend something", emit one or two suggest actions and a charming pitch.

CONVERSATION — not every message is an order:
- Greetings ("hi", "bonsoir"), thanks, small talk, or questions ("do you have X?", "is the steak good?") → reply warmly, set actions=[]. Do NOT add anything.
- Negation is NOT an order: "I don't want hot chicken", "no chicken", "not the burger" → never add that item. If it's in the cart, remove it; if not, just acknowledge with actions=[].
- "can I get / I'll have / give me / add / I want" signals a real order — only then emit add actions.
- When unsure whether the user wants to order, ask a short friendly question instead of guessing.

OUTPUT — respond with ONLY a raw JSON object (no markdown, no code fences), exactly this shape:
{
  "reply": "<1-2 sentence charming reply>",
  "actions": [ <zero or more action objects> ],
  "last_item_ref": "<line_id or item name of the most relevant item, or null>"
}
Action object shapes:
  { "type": "add", "item_id": <number>, "qty": <number>, "modifiers": { "spice"?, "size"?, "doneness"?, "addons"?: [..], "note"? } }
  { "type": "remove", "item_id": <number> }   or   { "type": "remove", "line_id": "<id>" }
  { "type": "modify", "line_id": "<id or '<last>'>", "modifiers": { ... } }
  { "type": "clear" }
  { "type": "suggest", "item_id": <number> }
Rules: always include "reply" and "actions" (actions may be []). Never invent item IDs not in the menu.
If the user wants something not on the menu, set actions=[] and say so warmly.`;
}

// Pull the first balanced JSON object out of a string (handles stray markdown fences).
function extractJson(text) {
  if (!text) return null;
  let s = text.trim();
  if (s.startsWith('```')) s = s.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
  const start = s.indexOf('{');
  const end = s.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) return null;
  try {
    return JSON.parse(s.slice(start, end + 1));
  } catch {
    return null;
  }
}

// gemini-2.5-flash is what the free-tier key reliably has access to (~5 req/min).
// If Gemini is rate-limited the rule-based parser below covers every action type,
// so the chat keeps working — it just swaps charming copy for plainer copy.
// Override with GEMINI_MODEL (e.g. a paid-tier model) for higher throughput.
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

async function callGemini({ messages, cart, context }) {
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: systemPrompt(),
    // responseMimeType alone forces valid JSON without the brittleness of a strict
    // nested responseSchema (which made Flash intermittently error out).
    generationConfig: { responseMimeType: 'application/json', temperature: 0.4 },
  });

  const userTurn = messages.at(-1)?.content || '';
  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }],
  }));
  // Gemini requires chat history to start with a 'user' turn — drop any leading
  // model turns (Léa's seed greeting is an assistant message with no user before it).
  while (history.length && history[0].role !== 'user') history.shift();

  const ctxBlock = `CURRENT_CART: ${JSON.stringify(cart)}
LAST_ITEM_REF: ${context.last_item_ref || 'none'}

USER: ${userTurn}`;

  const chat = model.startChat({ history });
  const result = await chat.sendMessage(ctxBlock);
  return extractJson(result.response.text());
}

export async function parseOrder({ messages = [], cart = [], context = {} }) {
  const lastUser = messages.at(-1)?.content || '';
  // Mock fallback when no API key — keeps the app functional in dev without one.
  if (!genAI) return mockReply(lastUser);

  // Try Gemini (one retry, but not for quota errors — those won't clear instantly),
  // then fall back to the rule-based parser so the chat NEVER hard-fails on a user.
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const parsed = await callGemini({ messages, cart, context });
      if (parsed && parsed.reply) {
        return {
          reply: parsed.reply,
          actions: Array.isArray(parsed.actions) ? parsed.actions : [],
          last_item_ref: parsed.last_item_ref || context.last_item_ref || null,
        };
      }
    } catch (e) {
      const rateLimited = /429|quota|rate/i.test(e.message || '');
      console.error(`[gemini] attempt ${attempt + 1} failed:`, e.message);
      if (rateLimited) break; // retrying a quota error is pointless
    }
  }

  console.warn('[gemini] falling back to rule-based parser');
  return mockReply(lastUser, cart, context);
}

// Rule-based fallback parser — used when there's no API key, or when Gemini is
// rate-limited / erroring. Multi-intent: scans the whole sentence for every dish.
// Patterns are distinctive on purpose — the fallback only needs to catch clear
// single mentions; Gemini handles the ambiguous phrasing when it's available.
const DISH_PATTERNS = [
  { id: 1,  name: 'Nashville Hot Chicken',  re: /nashville|hot chicken|spicy chicken|chicken sandwich|fried chicken/ },
  { id: 9,  name: 'Coq au Vin',             re: /coq au vin|\bcoq\b/ },
  { id: 12, name: 'Roast Half Chicken',     re: /roast(ed)? (half )?chicken|half chicken/ },
  { id: 2,  name: 'Truffle Smash Burger',   re: /burger|smash/ },
  { id: 10, name: 'Duck Confit',            re: /\bduck\b|confit/ },
  { id: 4,  name: 'Steak Frites',           re: /steak/ },
  { id: 13, name: 'Pan-Seared Salmon',      re: /salmon/ },
  { id: 14, name: 'Croque Madame',          re: /croque|madame/ },
  { id: 11, name: 'Wild Mushroom Risotto',  re: /risotto/ },
  { id: 15, name: 'Ratatouille Niçoise',    re: /ratatouille/ },
  { id: 3,  name: 'Heirloom Tomato Salad',  re: /tomato salad|heirloom|burrata/ },
  { id: 7,  name: 'Caesar Salad',           re: /caesar/ },
  { id: 16, name: 'Truffle Mac & Gruyère',  re: /mac ?(&|and)? ?(cheese|gruy)|truffle mac/ },
  { id: 17, name: 'Garlic Green Beans',     re: /green bean|haricot/ },
  { id: 18, name: 'Pomme Purée',            re: /pomme|mashed potato|whipped potato|pur[eé]e/ },
  { id: 5,  name: 'Hand-cut Fries',         re: /\bfries\b/ },
  { id: 8,  name: 'Chocolate Pot de Crème', re: /chocolate|pot de cr[eè]me/ },
  { id: 19, name: 'Crème Brûlée',           re: /br[uû]l[eé]e|creme brulee/ },
  { id: 20, name: 'Tarte Tatin',            re: /tarte|tatin|apple tart/ },
  { id: 21, name: 'Lemon-Basil Sorbet',     re: /sorbet/ },
  { id: 22, name: 'House Red',              re: /house red|red wine|glass of (red|wine)|\bwine\b/ },
  { id: 23, name: 'Craft Lemonade',         re: /lemonade/ },
  { id: 24, name: 'Espresso',               re: /espresso|\bcoffee\b/ },
  { id: 25, name: 'Sparkling Cider',        re: /\bcider\b/ },
  { id: 6,  name: 'Sparkling Water',        re: /\bwater\b|sparkling water/ },
];

function qtyNear(text, idx) {
  // Look at the ~16 chars before a dish mention for a quantity word/number.
  const window = text.slice(Math.max(0, idx - 16), idx);
  const m = window.match(/(one|two|three|four|five|six|\d+)\D*$/);
  const words = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };
  if (!m) return 1;
  return words[m[1]] || parseInt(m[1], 10) || 1;
}

function mockReply(text, cart = [], context = {}) {
  const t = (text || '').toLowerCase().trim();
  let last = context.last_item_ref || null;
  const cartItemIds = new Set((cart || []).map((l) => l.item_id));

  // ── Non-orders: greetings, thanks, chitchat — reply warmly, never add ──
  if (!t || t.length < 2) {
    return { reply: "I'm all ears — what would you like to order?", actions: [], last_item_ref: last };
  }
  if (/^(hi|hey|hello|yo|sup|bonsoir|bonjour|good (morning|afternoon|evening)|howdy)\b/.test(t)) {
    return { reply: "Bonsoir! I'm Léa. Tell me what you're in the mood for and I'll build your ticket.", actions: [], last_item_ref: last };
  }
  if (/^(thanks|thank you|merci|ok|okay|cool|great|nice|perfect|cheers|got it)\b/.test(t) && t.length < 24) {
    return { reply: 'With pleasure. Anything else for your ticket?', actions: [], last_item_ref: last };
  }
  if (/^(no|nope|nah|that'?s (all|it)|i'?m good|nothing else)\b/.test(t)) {
    return { reply: 'Parfait — your ticket is ready whenever you are.', actions: [], last_item_ref: last };
  }

  // ── Clear ──
  if (/\b(clear|empty|reset|start over)\b/.test(t) || /^cancel( everything| the order| my order)?$/.test(t)) {
    return { reply: 'Cleared the ticket — a fresh start.', actions: [{ type: 'clear' }], last_item_ref: null };
  }

  // ── Spice modify on the last item ──
  if (/less spicy|not so spicy|tone .*down|milder|too spicy/.test(t)) {
    return { reply: 'Toned it down to medium.', actions: [{ type: 'modify', line_id: '<last>', modifiers: { spice: 'Medium' } }], last_item_ref: last };
  }
  if (/\bmake it mild|not spicy at all|no spice\b/.test(t)) {
    return { reply: 'Made it mild.', actions: [{ type: 'modify', line_id: '<last>', modifiers: { spice: 'Mild' } }], last_item_ref: last };
  }
  if (/extra spicy|spicier|make it burn|hotter|as hot as/.test(t)) {
    return { reply: 'Cranked it to Nashville Hot 🌶', actions: [{ type: 'modify', line_id: '<last>', modifiers: { spice: 'Nashville Hot' } }], last_item_ref: last };
  }

  // ── Recommendations ──
  if (/recommend|suggest|what.*good|what.*should|what.*get|surprise me|what'?s popular/.test(t)) {
    return {
      reply: "Tonight's hot ticket is the Nashville Hot, but the steak frites never disappoints.",
      actions: [{ type: 'suggest', item_id: 1 }, { type: 'suggest', item_id: 4 }],
      last_item_ref: null,
    };
  }

  // ── Intent detection ──
  const negated = /\b(don'?t|do not|never ?mind|without|cancel the|hold the|skip the|not the|no more)\b/.test(t);
  const removeWord = /\b(remove|take off|delete|get rid of)\b/.test(t);
  const isQuestion = t.endsWith('?') || /^(do|does|did|is|are|can|could|would|will|what|which|how|why|where|when|who|tell me)\b/.test(t);
  const orderPhrase = /\b(can i (get|have|order|grab)|i'?ll (have|take|get|do)|i (want|need|would like)|give me|get me|add|order|let'?s (do|get)|i'?d like)\b/.test(t);

  // Scan for dishes mentioned anywhere in the sentence.
  const found = [];
  for (const dish of DISH_PATTERNS) {
    const idx = t.search(dish.re);
    if (idx !== -1) found.push({ dish, idx });
  }

  // A question that isn't an explicit order ("is the steak good?") → answer, don't add.
  if (isQuestion && !orderPhrase) {
    if (found.length) {
      const d = found[0].dish;
      return { reply: `The ${d.name} is one of our favourites — would you like me to add it?`, actions: [], last_item_ref: d.name };
    }
    return { reply: "Happy to help — would you like to see the menu, or shall I suggest something?", actions: [], last_item_ref: last };
  }

  // Negation: "I don't want hot chicken" → never add. Remove only if it's in the cart.
  if ((negated || removeWord) && found.length) {
    const removable = found.filter((f) => cartItemIds.has(f.dish.id));
    if (removable.length) {
      return {
        reply: 'Done — taken off your ticket.',
        actions: removable.map((f) => ({ type: 'remove', item_id: f.dish.id })),
        last_item_ref: removable[0].dish.name,
      };
    }
    return { reply: 'No problem — leaving that off. What would you like instead?', actions: [], last_item_ref: last };
  }

  // No dish detected and not a recognised intent → ask, don't guess.
  if (found.length === 0) {
    return {
      reply: "I didn't catch a dish in that — tell me what you'd like, e.g. \"two spicy chicken sandwiches and a large water\".",
      actions: [],
      last_item_ref: last,
    };
  }

  // Genuine order — add each dish found.
  const actions = [];
  for (const { dish, idx } of found) {
    const mods = {};
    if (dish.id === 1 && /spicy|hot/.test(t)) mods.spice = 'Hot';
    if (dish.id === 6) mods.size = /large/.test(t) ? 'Large' : 'Small';
    actions.push({ type: 'add', item_id: dish.id, qty: qtyNear(t, idx), modifiers: mods });
    last = dish.name;
  }
  const names = found.map((f) => f.dish.name);
  return { reply: `Adding ${names.join(' and ')} — à la commande.`, actions, last_item_ref: last };
}
