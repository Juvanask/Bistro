// Canonical menu — shared shape between backend (AI grounding) and frontend (UI).
// IDs are stable; the Gemini system prompt embeds this so action.item_id is trustworthy.

export const BRAND = { name: 'Bistro', tag: 'a neighborhood bistro', est: '2024' };

export const CATEGORIES = ['Signatures', 'Plates', 'Sides', 'Sweets', 'Drinks'];

export const ITEMS = [
  // ── SIGNATURES ──────────────────────────────────────────────
  {
    id: 1,
    name: 'Nashville Hot Chicken',
    sub: 'spicy · brioche · pickle slaw',
    desc: 'Buttermilk-brined thigh, our house chili oil, dill pickle slaw on a toasted brioche bun. Hand-cut fries on the side.',
    price: 16, cat: 'Signatures', tone: 'red', heat: 3, tag: '№ 04', rating: 4.9,
    modifiers: [
      { name: 'spice', options: ['Mild', 'Medium', 'Hot', 'Nashville Hot'], default: 'Hot' },
      { name: 'addons', multi: true, options: [
        { name: 'Extra pickles', price: 0 },
        { name: 'Avocado', price: 2 },
        { name: 'Side caesar (sub fries)', price: 3 },
      ] },
    ],
  },
  {
    id: 2,
    name: 'Truffle Smash Burger',
    sub: 'double · gruyère · truffle aioli',
    desc: 'Two seared patties, gruyère, caramelized onion, truffle aioli on a milk bun. Fries on the side.',
    price: 18, cat: 'Signatures', tone: 'gold', heat: 0, tag: '№ 02', rating: 4.8,
    modifiers: [
      { name: 'doneness', options: ['Medium rare', 'Medium', 'Medium well'], default: 'Medium' },
      { name: 'addons', multi: true, options: [
        { name: 'Extra patty', price: 4 },
        { name: 'Avocado', price: 2 },
        { name: 'Bacon', price: 3 },
      ] },
    ],
  },
  {
    id: 9,
    name: 'Coq au Vin',
    sub: 'red wine · pearl onions · lardons',
    desc: 'Chicken braised low in Burgundy with pearl onions, button mushrooms and smoked lardons. Served over pomme purée.',
    price: 24, cat: 'Signatures', tone: 'red', heat: 0, tag: '№ 05', rating: 4.8,
    modifiers: [
      { name: 'addons', multi: true, options: [
        { name: 'Extra lardons', price: 3 },
        { name: 'Crusty bread', price: 2 },
      ] },
    ],
  },
  {
    id: 10,
    name: 'Duck Confit',
    sub: 'crispy leg · frisée · cherry gastrique',
    desc: 'Twelve-hour duck leg confit, crisped to order, with a bitter frisée salad and a sour-cherry gastrique.',
    price: 27, cat: 'Signatures', tone: 'gold', heat: 0, tag: '№ 03', rating: 4.9,
  },
  {
    id: 11,
    name: 'Wild Mushroom Risotto',
    sub: 'carnaroli · parmesan · truffle oil',
    desc: 'Carnaroli rice slow-stirred with wild mushrooms, finished with aged parmesan and a thread of truffle oil.',
    price: 21, cat: 'Signatures', tone: 'green', heat: 0, tag: '№ 09', rating: 4.7,
    modifiers: [
      { name: 'addons', multi: true, options: [
        { name: 'Grilled chicken', price: 6 },
        { name: 'Sautéed shrimp', price: 7 },
      ] },
    ],
  },

  // ── PLATES ──────────────────────────────────────────────────
  {
    id: 3,
    name: 'Heirloom Tomato Salad',
    sub: 'burrata · basil oil · sea salt',
    desc: 'Three-color heirlooms, fresh burrata, basil oil, flaked Maldon, cracked pepper.',
    price: 14, cat: 'Plates', tone: 'green', heat: 0, tag: '№ 07', rating: 4.7,
  },
  {
    id: 4,
    name: 'Steak Frites',
    sub: 'hanger · herb butter',
    desc: "Pasture-raised hanger, seared rare, sliced over hand-cut fries with maître d' butter.",
    price: 26, cat: 'Plates', tone: 'gold', heat: 0, tag: '№ 01', rating: 4.9,
    modifiers: [
      { name: 'doneness', options: ['Rare', 'Medium rare', 'Medium', 'Medium well'], default: 'Medium rare' },
    ],
  },
  {
    id: 12,
    name: 'Roast Half Chicken',
    sub: 'lemon · thyme jus · fingerlings',
    desc: 'Free-range half chicken roasted with lemon and thyme, fingerling potatoes, a glossy pan jus.',
    price: 23, cat: 'Plates', tone: 'gold', heat: 0, tag: '№ 06', rating: 4.7,
  },
  {
    id: 13,
    name: 'Pan-Seared Salmon',
    sub: 'crispy skin · beurre blanc · leeks',
    desc: 'Scottish salmon seared crisp-skin, braised leeks, a classic beurre blanc.',
    price: 25, cat: 'Plates', tone: 'red', heat: 0, tag: '№ 08', rating: 4.8,
    modifiers: [
      { name: 'doneness', options: ['Medium rare', 'Medium', 'Well done'], default: 'Medium' },
    ],
  },
  {
    id: 14,
    name: 'Croque Madame',
    sub: 'jambon · gruyère · fried egg',
    desc: 'Griddled ham and gruyère, mornay sauce, a sunny fried egg on top.',
    price: 16, cat: 'Plates', tone: 'gold', heat: 0, tag: '№ 10', rating: 4.6,
    modifiers: [
      { name: 'addons', multi: true, options: [
        { name: 'Extra egg', price: 2 },
        { name: 'Side salad', price: 4 },
      ] },
    ],
  },
  {
    id: 15,
    name: 'Ratatouille Niçoise',
    sub: 'summer vegetables · basil · vegan',
    desc: 'Provençal stew of courgette, aubergine, peppers and tomato with basil and good olive oil.',
    price: 18, cat: 'Plates', tone: 'green', heat: 1, tag: '№ 13', rating: 4.5,
  },

  // ── SIDES ───────────────────────────────────────────────────
  {
    id: 5,
    name: 'Hand-cut Fries',
    sub: 'rosemary salt',
    desc: 'Twice-cooked, tossed in rosemary salt. Aioli on the side.',
    price: 6, cat: 'Sides', tone: 'gold', heat: 0, tag: '№ 11', rating: 4.8,
  },
  {
    id: 7,
    name: 'Caesar Salad',
    sub: 'gem lettuce · anchovy · pecorino',
    desc: 'Little gems, classic anchovy dressing, brioche croutons, shaved pecorino.',
    price: 12, cat: 'Sides', tone: 'green', heat: 0, tag: '№ 12', rating: 4.5,
  },
  {
    id: 16,
    name: 'Truffle Mac & Gruyère',
    sub: 'cavatappi · three cheese · chive',
    desc: 'Cavatappi in a three-cheese sauce with shaved truffle and chive.',
    price: 11, cat: 'Sides', tone: 'gold', heat: 0, tag: '№ 14', rating: 4.8,
  },
  {
    id: 17,
    name: 'Garlic Green Beans',
    sub: 'haricots verts · shallot · almond',
    desc: 'Blanched haricots verts tossed with garlic, crispy shallot and toasted almond.',
    price: 8, cat: 'Sides', tone: 'green', heat: 0, tag: '№ 15', rating: 4.4,
  },
  {
    id: 18,
    name: 'Pomme Purée',
    sub: 'whipped potato · brown butter',
    desc: 'Silky whipped potato finished with nutty brown butter and sea salt.',
    price: 7, cat: 'Sides', tone: 'cream', heat: 0, tag: '№ 16', rating: 4.6,
  },

  // ── SWEETS ──────────────────────────────────────────────────
  {
    id: 8,
    name: 'Chocolate Pot de Crème',
    sub: 'dark chocolate · sea salt',
    desc: '70% dark chocolate, crème fraîche, fleur de sel.',
    price: 9, cat: 'Sweets', tone: '', heat: 0, tag: '№ 31', rating: 4.9,
  },
  {
    id: 19,
    name: 'Crème Brûlée',
    sub: 'tahitian vanilla · burnt sugar',
    desc: 'Tahitian vanilla custard under a crackling sheet of torched sugar.',
    price: 10, cat: 'Sweets', tone: 'cream', heat: 0, tag: '№ 32', rating: 4.9,
  },
  {
    id: 20,
    name: 'Tarte Tatin',
    sub: 'caramelized apple · crème fraîche',
    desc: 'Upside-down caramelized apple tart, served warm with crème fraîche.',
    price: 11, cat: 'Sweets', tone: 'gold', heat: 0, tag: '№ 33', rating: 4.7,
  },
  {
    id: 21,
    name: 'Lemon-Basil Sorbet',
    sub: 'house-churned · candied zest',
    desc: 'House-churned lemon sorbet with a whisper of basil and candied zest.',
    price: 8, cat: 'Sweets', tone: 'cream', heat: 0, tag: '№ 34', rating: 4.5,
  },

  // ── DRINKS ──────────────────────────────────────────────────
  {
    id: 6,
    name: 'Sparkling Water',
    sub: 'small / large',
    desc: 'Filtered, lightly carbonated, served chilled.',
    price: 4, cat: 'Drinks', tone: 'cream', heat: 0, tag: '№ 22', rating: 4.6,
    modifiers: [
      { name: 'size', options: ['Small', 'Large'], default: 'Small', priceDelta: { Small: 0, Large: 1 } },
    ],
  },
  {
    id: 22,
    name: 'House Red',
    sub: 'côtes du rhône · by the glass',
    desc: 'A juicy, peppery Côtes du Rhône — poured by the glass or carafe.',
    price: 9, cat: 'Drinks', tone: 'red', heat: 0, tag: '№ 21', rating: 4.6,
    modifiers: [
      { name: 'size', options: ['Glass', 'Carafe'], default: 'Glass', priceDelta: { Glass: 0, Carafe: 16 } },
    ],
  },
  {
    id: 23,
    name: 'Craft Lemonade',
    sub: 'meyer lemon · mint · soda',
    desc: 'Meyer lemon pressed to order with muddled mint and a splash of soda.',
    price: 6, cat: 'Drinks', tone: 'gold', heat: 0, tag: '№ 23', rating: 4.7,
    modifiers: [
      { name: 'size', options: ['Small', 'Large'], default: 'Small', priceDelta: { Small: 0, Large: 2 } },
    ],
  },
  {
    id: 24,
    name: 'Espresso',
    sub: 'single origin · double shot',
    desc: 'A double shot of single-origin espresso, pulled short.',
    price: 4, cat: 'Drinks', tone: '', heat: 0, tag: '№ 24', rating: 4.8,
  },
  {
    id: 25,
    name: 'Sparkling Cider',
    sub: 'normandy apple · dry',
    desc: 'Dry Normandy cider, lightly sparkling and bone-dry.',
    price: 7, cat: 'Drinks', tone: 'gold', heat: 0, tag: '№ 25', rating: 4.5,
    modifiers: [
      { name: 'size', options: ['Small', 'Large'], default: 'Small', priceDelta: { Small: 0, Large: 2 } },
    ],
  },
];

export const MENU = { brand: BRAND, categories: CATEGORIES, items: ITEMS };

export function findItem(id) {
  return ITEMS.find((i) => i.id === id);
}

export function findItemByName(query) {
  if (!query) return null;
  const q = String(query).toLowerCase();
  return (
    ITEMS.find((i) => i.name.toLowerCase() === q) ||
    ITEMS.find((i) => i.name.toLowerCase().includes(q)) ||
    ITEMS.find((i) => q.includes(i.name.toLowerCase().split(' ')[0]))
  );
}
