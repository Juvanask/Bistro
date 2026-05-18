# Bistro — Order with Léa

A premium, AI-led restaurant ordering experience. You're greeted by **Léa**, an AI concierge — tell her what you're craving in plain language (or by voice) and dishes animate onto your table in real time.

Built in an iOS **"liquid glass"** aesthetic: warm cream paper, translucent backdrop-blurred surfaces, depth and motion throughout. No food photography — every dish is told through an **ingredient colour story** and a plate that *plates itself* on open.

---

## Stack

**Frontend** — Expo SDK 52 · Expo Router · React Native (JavaScript) · Zustand with AsyncStorage persistence · React Native Reanimated 3 · `react-native-svg` · `expo-blur` · `expo-linear-gradient` · `expo-haptics` · Web Speech API for live voice.

**Backend** — Node.js + Express · **Google Gemini 2.5 Flash** (`@google/generative-ai`) in JSON mode for structured output · Zod validation against the canonical menu.

---

## Run it

```bash
# 1 — backend
cd backend
cp .env.example .env          # add your GEMINI_API_KEY (optional — see note below)
npm install
npm run dev                   # → http://localhost:4000

# 2 — frontend (second terminal)
cd frontend
cp .env.example .env          # set EXPO_PUBLIC_API_URL if the backend isn't on :4000
npm install
npm start                     # press w for web — recommended (live voice runs there)
```

> Without a `GEMINI_API_KEY` the backend runs in mock mode — a rule-based parser handles the
> canonical demo orders, so the app stays fully functional for development.

---

## The experience

### Screens

| Screen | What it does |
|---|---|
| Welcome | Léa-led entrance — the orb breathes in, then "Order with Léa / Browse / or just say it" |
| Home | Léa greeting card, "What's hot", chef's specials |
| Menu | All 25 dishes by category, with an editorial live search |
| Item | The plate paints itself in the dish's colours, then settles; spice/size/add-on controls + a kitchen note |
| Chat | Talk to Léa — animated bubbles, typing indicator, inline dish cards, voice input |
| Cart | Glass line items, "Added by Léa" tags, quantity steppers, totals |
| Checkout | A conversational confirmation from Léa |

### AI conversation → cart

Type or say *"add a spicy burger and fries"* and the backend returns structured JSON:

```json
{
  "reply": "A Truffle Smash Burger hot off the grill, and crispy hand-cut fries — heading your way.",
  "actions": [
    { "type": "add", "item_id": 2, "qty": 1, "modifiers": {} },
    { "type": "add", "item_id": 5, "qty": 1, "modifiers": {} }
  ],
  "context": { "last_item_ref": "Truffle Smash Burger" }
}
```

The frontend applies each action with a staggered delay so dishes land one at a time. Action types: `add`, `remove`, `modify`, `clear`, `suggest`. Follow-ups like *"make that less spicy"* resolve through `context.last_item_ref`. Every action Gemini returns is Zod-validated against the menu server-side — invented items are dropped. A rule-based parser is a fallback so the chat never hard-fails.

### Imagery — the ingredient colour story

No photos. Each dish carries a colour palette derived from its ingredients. On cards it renders as a row of shaded discs; on the detail screen the plate "plates itself" — colour coats paint in over ~1s, then the dish illustration settles on top.

---

## Repo structure

```
intelligent-bistro/
├── backend/
│   ├── server.js
│   └── src/
│       ├── ai/         gemini.js (Léa prompt + JSON mode + fallback), validate.js
│       ├── data/       menu.js  (25 dishes — canonical source of truth)
│       └── routes/     chat · menu · order
└── frontend/
    ├── app/            expo-router screens (welcome, home, menu, item, chat, cart, checkout)
    ├── components/     LeaOrb, Glass, DishVessel, IngredientDots, ChatBubble, TabBar, VoiceModal …
    ├── store/          Zustand stores — cart, chat, theme, ui
    ├── lib/            api, speech (Web Speech API), dishActions, color, haptics
    └── constants/      design tokens, menu data
```

---

## Notes

- Live voice runs on the **web** target (browser Speech Recognition); on native the voice modal explains this and falls back to typing.
- Cart, chat, and theme persist across reloads via AsyncStorage.
- One Expo codebase — runs on iOS, Android, and web.
