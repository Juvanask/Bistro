// Menu — 25 dishes. Each carries an "ingredient color story" (palette + labels)
// and a stylized "vessel" composition instead of food photography.
// Mirrors backend/src/data/menu.js for id/name/price/cat/modifiers.

import { luminance } from '../lib/color';

export const CATEGORIES = ['Signatures', 'Plates', 'Sides', 'Sweets', 'Drinks'];

const RAW = [
  // ── SIGNATURES ──────────────────────────────────────────────
  {
    id: 1, name: 'Nashville Hot Chicken', cat: 'Signatures',
    tagline: 'Lacquered · Smoky · Crisp',
    blurb: 'Buttermilk-brined thigh, fried twice, glazed in honey-cayenne lacquer over milk bread with bread-and-butter pickles.',
    price: 16, heat: 4, rating: 4.9, ambient: 'hot', vessel: '#efe2c4', steam: true,
    palette: ['#c44a25', '#d8a637', '#3a2418', '#f2e6c8', '#8c2418', '#5a6232'],
    paletteLabels: ['cayenne', 'honey', 'char', 'brioche', 'paprika', 'pickle'],
    chips: ['spicier', 'extra pickles', 'pair with cider'],
    modifiers: [
      { name: 'spice', options: ['Mild', 'Medium', 'Hot', 'Nashville Hot'], default: 'Hot' },
      { name: 'addons', multi: true, options: [
        { name: 'Extra pickles', price: 0 }, { name: 'Avocado', price: 2 }, { name: 'Side caesar', price: 3 },
      ] },
    ],
  },
  {
    id: 2, name: 'Truffle Smash Burger', cat: 'Signatures',
    tagline: 'Charred · Funky · Rich',
    blurb: 'Two seared patties, melted gruyère, caramelized onion and black-truffle aioli on a toasted milk bun.',
    price: 18, heat: 0, rating: 4.8, ambient: 'earth', vessel: '#e8dab8', steam: true,
    palette: ['#5a3420', '#e8c878', '#2a2419', '#f0dcae', '#8a5a3a', '#f5ead0'],
    paletteLabels: ['patty', 'gruyère', 'truffle', 'milk bun', 'onion', 'aioli'],
    chips: ['add bacon', 'extra patty', 'medium rare'],
    modifiers: [
      { name: 'doneness', options: ['Medium rare', 'Medium', 'Medium well'], default: 'Medium' },
      { name: 'addons', multi: true, options: [
        { name: 'Extra patty', price: 4 }, { name: 'Avocado', price: 2 }, { name: 'Bacon', price: 3 },
      ] },
    ],
  },
  {
    id: 9, name: 'Coq au Vin', cat: 'Signatures',
    tagline: 'Braised · Winey · Deep',
    blurb: 'Chicken braised low in Burgundy with pearl onions, button mushrooms and smoked lardons over pomme purée.',
    price: 24, heat: 0, rating: 4.8, ambient: 'earth', vessel: '#2a1620', steam: true,
    palette: ['#5a1c2e', '#8a5a3a', '#ecdfc4', '#7a3a2a', '#3a2a22', '#2a1418'],
    paletteLabels: ['burgundy', 'chicken', 'onion', 'lardon', 'mushroom', 'jus'],
    chips: ['add bread', 'pair with red', 'lighter please'],
    modifiers: [
      { name: 'addons', multi: true, options: [
        { name: 'Extra lardons', price: 3 }, { name: 'Crusty bread', price: 2 },
      ] },
    ],
  },
  {
    id: 10, name: 'Duck Confit', cat: 'Signatures',
    tagline: 'Crisp · Rich · Tart',
    blurb: 'Twelve-hour duck leg confit, crisped to order, with a bitter frisée salad and sour-cherry gastrique.',
    price: 27, heat: 0, rating: 4.9, ambient: 'hot', vessel: '#2a1c12', steam: true,
    palette: ['#7a3a22', '#c4814a', '#9aae5a', '#7a1c2e', '#b03a3a', '#f0dcae'],
    paletteLabels: ['duck', 'crispy skin', 'frisée', 'cherry', 'gastrique', 'fat'],
    chips: ['extra crisp', 'pair with red', 'shareable'],
  },
  {
    id: 11, name: 'Wild Mushroom Risotto', cat: 'Signatures',
    tagline: 'Earthy · Creamy · Umami',
    blurb: 'Carnaroli rice slow-stirred with wild mushrooms, finished with aged parmesan and a thread of truffle oil.',
    price: 21, heat: 0, rating: 4.7, ambient: 'earth', vessel: '#2a1f14', steam: true,
    palette: ['#ebe0b8', '#7a6750', '#2a2419', '#f5eac8', '#5a6232', '#1a1a1a'],
    paletteLabels: ['carnaroli', 'shimeji', 'truffle', 'parm', 'olive oil', 'pepper'],
    chips: ['add chicken', 'add shrimp', 'vegan version'],
    modifiers: [
      { name: 'addons', multi: true, options: [
        { name: 'Grilled chicken', price: 6 }, { name: 'Sautéed shrimp', price: 7 },
      ] },
    ],
  },

  // ── PLATES ──────────────────────────────────────────────────
  {
    id: 3, name: 'Heirloom Tomato Salad', cat: 'Plates',
    tagline: 'Bright · Milky · Herbal',
    blurb: 'Three-colour heirlooms, fresh burrata, basil oil, aged balsamic and flaked Maldon.',
    price: 14, heat: 0, rating: 4.7, ambient: 'fresh', vessel: '#f0e6cf', steam: false,
    palette: ['#c1452f', '#faf5e8', '#4a6a30', '#e3b23a', '#3a1f1a', '#e8e2d0'],
    paletteLabels: ['tomato', 'burrata', 'basil', 'gold tomato', 'balsamic', 'maldon'],
    chips: ['shareable', 'add bread', 'something heartier'],
  },
  {
    id: 4, name: 'Steak Frites', cat: 'Plates',
    tagline: 'Seared · Buttery · Rare',
    blurb: 'Pasture-raised hanger, seared rare and sliced over hand-cut fries with maître d’ butter.',
    price: 26, heat: 0, rating: 4.9, ambient: 'earth', vessel: '#2a1f16', steam: true,
    palette: ['#6a2e22', '#2a1a12', '#d8a637', '#c8c87a', '#3a2418', '#f2ece0'],
    paletteLabels: ['hanger', 'char', 'fries', 'herb butter', 'jus', 'sea salt'],
    chips: ['medium rare', 'pair with red', 'extra fries'],
    modifiers: [
      { name: 'doneness', options: ['Rare', 'Medium rare', 'Medium', 'Medium well'], default: 'Medium rare' },
    ],
  },
  {
    id: 12, name: 'Roast Half Chicken', cat: 'Plates',
    tagline: 'Roasted · Lemony · Juicy',
    blurb: 'Free-range half chicken roasted with lemon and thyme, fingerling potatoes and a glossy pan jus.',
    price: 23, heat: 0, rating: 4.7, ambient: 'citrus', vessel: '#efe2c4', steam: true,
    palette: ['#c88a3a', '#e8d068', '#4a6a30', '#e0c98a', '#6a4226', '#3a2418'],
    paletteLabels: ['golden skin', 'lemon', 'thyme', 'fingerling', 'jus', 'char'],
    chips: ['add greens', 'lighter please', 'shareable'],
  },
  {
    id: 13, name: 'Pan-Seared Salmon', cat: 'Plates',
    tagline: 'Crisp-skin · Buttery · Bright',
    blurb: 'Scottish salmon seared crisp-skin over braised leeks with a classic beurre blanc.',
    price: 25, heat: 0, rating: 4.8, ambient: 'fresh', vessel: '#1a2218', steam: true,
    palette: ['#e58a6e', '#c46a3a', '#7a9a5a', '#f0e8d0', '#3a2418', '#5a7a3a'],
    paletteLabels: ['salmon', 'crispy skin', 'leek', 'beurre blanc', 'char', 'dill'],
    chips: ['well done', 'add greens', 'pair with white'],
    modifiers: [
      { name: 'doneness', options: ['Medium rare', 'Medium', 'Well done'], default: 'Medium' },
    ],
  },
  {
    id: 14, name: 'Croque Madame', cat: 'Plates',
    tagline: 'Toasted · Cheesy · Golden',
    blurb: 'Griddled ham and gruyère under mornay sauce with a sunny fried egg on top.',
    price: 16, heat: 0, rating: 4.6, ambient: 'citrus', vessel: '#f0e2c6', steam: true,
    palette: ['#e8c878', '#c46a6a', '#f0dcae', '#f5ead0', '#e8b13a', '#6a4226'],
    paletteLabels: ['gruyère', 'ham', 'shokupan', 'mornay', 'egg yolk', 'char'],
    chips: ['extra egg', 'add side salad', 'brunch'],
    modifiers: [
      { name: 'addons', multi: true, options: [
        { name: 'Extra egg', price: 2 }, { name: 'Side salad', price: 4 },
      ] },
    ],
  },
  {
    id: 15, name: 'Ratatouille Niçoise', cat: 'Plates',
    tagline: 'Stewed · Summery · Vegan',
    blurb: 'A Provençal stew of courgette, aubergine, peppers and tomato with basil and good olive oil.',
    price: 18, heat: 1, rating: 4.5, ambient: 'earth', vessel: '#2a2018', steam: true,
    palette: ['#c1452f', '#5a7a3a', '#4a2a4a', '#d8a637', '#4a6a30', '#8a8a3a'],
    paletteLabels: ['tomato', 'courgette', 'aubergine', 'pepper', 'basil', 'olive oil'],
    chips: ['add bread', 'heartier', 'shareable'],
  },

  // ── SIDES ───────────────────────────────────────────────────
  {
    id: 5, name: 'Hand-cut Fries', cat: 'Sides',
    tagline: 'Crisp · Golden · Salted',
    blurb: 'Twice-cooked and tossed in rosemary salt, with garlic aioli on the side.',
    price: 6, heat: 0, rating: 4.8, ambient: 'citrus', vessel: '#efe2c4', steam: true,
    palette: ['#d8a637', '#e8c050', '#a66e2e', '#f2ece0', '#f5ead0', '#5a6232'],
    paletteLabels: ['fry', 'golden', 'potato skin', 'salt', 'aioli', 'rosemary'],
    chips: ['extra aioli', 'add to a main'],
  },
  {
    id: 7, name: 'Caesar Salad', cat: 'Sides',
    tagline: 'Crunchy · Sharp · Savoury',
    blurb: 'Little gems in a classic anchovy dressing with brioche croutons and shaved pecorino.',
    price: 12, heat: 0, rating: 4.5, ambient: 'fresh', vessel: '#f0e6cf', steam: false,
    palette: ['#7a9a3f', '#6a4a32', '#ece2c0', '#d8a85a', '#f0e4c4', '#2a2419'],
    paletteLabels: ['gem', 'anchovy', 'pecorino', 'crouton', 'dressing', 'pepper'],
    chips: ['add chicken', 'no anchovy'],
  },
  {
    id: 16, name: 'Truffle Mac & Gruyère', cat: 'Sides',
    tagline: 'Cheesy · Truffled · Baked',
    blurb: 'Cavatappi in a three-cheese sauce with shaved truffle, baked under a golden crumb.',
    price: 11, heat: 0, rating: 4.8, ambient: 'earth', vessel: '#e8dab8', steam: true,
    palette: ['#e8c878', '#f0dcae', '#2a2419', '#5a7a3a', '#c88a3a', '#f5ead0'],
    paletteLabels: ['cavatappi', 'gruyère', 'truffle', 'chive', 'crumb', 'cream'],
    chips: ['extra truffle', 'shareable'],
  },
  {
    id: 17, name: 'Garlic Green Beans', cat: 'Sides',
    tagline: 'Crisp · Garlicky · Nutty',
    blurb: 'Blanched haricots verts tossed with garlic, crispy shallot and toasted almond.',
    price: 8, heat: 0, rating: 4.4, ambient: 'fresh', vessel: '#1a2218', steam: true,
    palette: ['#4a6a30', '#ecdfc4', '#b07a3a', '#d8c89a', '#3a2418', '#8a8a3a'],
    paletteLabels: ['haricot', 'garlic', 'shallot', 'almond', 'char', 'oil'],
    chips: ['light', 'add to a main'],
  },
  {
    id: 18, name: 'Pomme Purée', cat: 'Sides',
    tagline: 'Silky · Buttery · Warm',
    blurb: 'Silky whipped potato finished with nutty brown butter and sea salt.',
    price: 7, heat: 0, rating: 4.6, ambient: 'creamy', vessel: '#f0e6cf', steam: true,
    palette: ['#f0e4c4', '#c88a3a', '#f5ead0', '#ece4d4', '#5a7a3a', '#d8a637'],
    paletteLabels: ['potato', 'brown butter', 'cream', 'sea salt', 'chive', 'gold'],
    chips: ['comforting', 'pair with steak'],
  },

  // ── SWEETS ──────────────────────────────────────────────────
  {
    id: 8, name: 'Chocolate Pot de Crème', cat: 'Sweets',
    tagline: 'Dark · Silky · Salted',
    blurb: '70% dark chocolate set into a silky custard with crème fraîche and fleur de sel.',
    price: 9, heat: 0, rating: 4.9, ambient: 'earth', vessel: '#1f120e', steam: false,
    palette: ['#2a1410', '#4a2a1e', '#f2e8d8', '#ece4d4', '#1a0e0a', '#d8a637'],
    paletteLabels: ['dark choc', 'cocoa', 'crème', 'fleur de sel', 'cacao nib', 'gold'],
    chips: ['add coffee', 'shareable'],
  },
  {
    id: 19, name: 'Crème Brûlée', cat: 'Sweets',
    tagline: 'Torched · Vanilla · Crackly',
    blurb: 'Tahitian vanilla custard under a crackling sheet of torched sugar.',
    price: 10, heat: 0, rating: 4.9, ambient: 'creamy', vessel: '#f4ead4', steam: false,
    palette: ['#f0dca8', '#b0702a', '#ecdfc4', '#f5ead0', '#8a5a2a', '#d8a637'],
    paletteLabels: ['custard', 'burnt sugar', 'vanilla', 'cream', 'caramel', 'gold'],
    chips: ['classic', 'pair with espresso'],
  },
  {
    id: 20, name: 'Tarte Tatin', cat: 'Sweets',
    tagline: 'Caramelized · Warm · Buttery',
    blurb: 'Upside-down caramelized apple tart, served warm with a spoon of crème fraîche.',
    price: 11, heat: 0, rating: 4.7, ambient: 'citrus', vessel: '#f0e2c6', steam: true,
    palette: ['#d8943a', '#8a5a2a', '#ecdfc4', '#f5ead0', '#e8c878', '#4a2a1a'],
    paletteLabels: ['apple', 'caramel', 'pastry', 'crème', 'butter', 'char'],
    chips: ['warm', 'add ice cream'],
  },
  {
    id: 21, name: 'Lemon-Basil Sorbet', cat: 'Sweets',
    tagline: 'Icy · Citrus · Herbal',
    blurb: 'House-churned lemon sorbet with a whisper of basil and candied zest.',
    price: 8, heat: 0, rating: 4.5, ambient: 'citrus', vessel: '#eef4e0', steam: false,
    palette: ['#ecd64a', '#6a8a3a', '#e8c050', '#f4f9f0', '#f5ead0', '#7aaa5a'],
    paletteLabels: ['lemon', 'basil', 'zest', 'ice', 'cream', 'mint'],
    chips: ['refreshing', 'light'],
  },

  // ── DRINKS ──────────────────────────────────────────────────
  {
    id: 6, name: 'Sparkling Water', cat: 'Drinks',
    tagline: 'Cold · Clean · Bright',
    blurb: 'Filtered, lightly carbonated and served chilled over ice.',
    price: 4, heat: 0, rating: 4.6, ambient: 'fresh', vessel: '#dfe9e6', steam: false,
    palette: ['#cfe4e8', '#aac6c8', '#eef6f5', '#dfe9e6', '#b0cccd', '#e8d68a'],
    paletteLabels: ['spring', 'mineral', 'bubble', 'glass', 'chill', 'lemon'],
    chips: ['large', 'with lemon'],
    modifiers: [
      { name: 'size', options: ['Small', 'Large'], default: 'Small', priceDelta: { Small: 0, Large: 1 } },
    ],
  },
  {
    id: 22, name: 'House Red', cat: 'Drinks',
    tagline: 'Juicy · Peppery · Bright',
    blurb: 'A juicy, peppery Côtes du Rhône — poured by the glass or carafe.',
    price: 9, heat: 0, rating: 4.6, ambient: 'earth', vessel: '#2a1620', steam: false,
    palette: ['#5a1c2e', '#7a2438', '#3a1420', '#e8d6c0', '#2a1018', '#9a3048'],
    paletteLabels: ['wine', 'ruby', 'garnet', 'glass', 'tannin', 'fruit'],
    chips: ['carafe', 'pair with steak'],
    modifiers: [
      { name: 'size', options: ['Glass', 'Carafe'], default: 'Glass', priceDelta: { Glass: 0, Carafe: 16 } },
    ],
  },
  {
    id: 23, name: 'Craft Lemonade', cat: 'Drinks',
    tagline: 'Tart · Minty · Cold',
    blurb: 'Meyer lemon pressed to order with muddled mint and a splash of soda.',
    price: 6, heat: 0, rating: 4.7, ambient: 'citrus', vessel: '#eef4e0', steam: false,
    palette: ['#ecd64a', '#6a9a4a', '#e8c050', '#f4f9f0', '#eef6f5', '#f5ead0'],
    paletteLabels: ['lemon', 'mint', 'zest', 'soda', 'ice', 'sugar'],
    chips: ['large', 'refreshing'],
    modifiers: [
      { name: 'size', options: ['Small', 'Large'], default: 'Small', priceDelta: { Small: 0, Large: 2 } },
    ],
  },
  {
    id: 24, name: 'Espresso', cat: 'Drinks',
    tagline: 'Dark · Intense · Crema',
    blurb: 'A double shot of single-origin espresso, pulled short.',
    price: 4, heat: 0, rating: 4.8, ambient: 'earth', vessel: '#1f120e', steam: true,
    palette: ['#2a1410', '#b07a3a', '#1a0e0a', '#ecdfc4', '#4a2a1a', '#c88a3a'],
    paletteLabels: ['espresso', 'crema', 'bean', 'cup', 'roast', 'gold'],
    chips: ['with dessert', 'double'],
  },
  {
    id: 25, name: 'Sparkling Cider', cat: 'Drinks',
    tagline: 'Dry · Apple · Crisp',
    blurb: 'Dry Normandy cider, lightly sparkling and bone-dry.',
    price: 7, heat: 0, rating: 4.5, ambient: 'citrus', vessel: '#efe2c4', steam: false,
    palette: ['#d8a637', '#c8943a', '#e8c050', '#f4f9e8', '#ecdfc4', '#e8d8b0'],
    paletteLabels: ['cider', 'apple', 'gold', 'bubble', 'glass', 'blossom'],
    chips: ['large', 'crisp'],
    modifiers: [
      { name: 'size', options: ['Small', 'Large'], default: 'Small', priceDelta: { Small: 0, Large: 2 } },
    ],
  },
];

// Deterministic "ingredient blob" composition for the dish vessel — varies per dish
// but is stable across renders. 5 blobs, scattered, sized descending.
const BLOB_SLOTS = [
  { x: 33, y: 35, s: 58 },
  { x: 64, y: 30, s: 46 },
  { x: 68, y: 66, s: 40 },
  { x: 35, y: 67, s: 36 },
  { x: 52, y: 52, s: 26 },
];

function vesselBlobs(item) {
  const jit = (n) => Math.sin(item.id * 12.9898 + n * 4.1414) * 8; // -8..8
  return BLOB_SLOTS.map((slot, i) => ({
    c: item.palette[i % item.palette.length],
    x: Math.max(22, Math.min(78, slot.x + jit(i))),
    y: Math.max(24, Math.min(76, slot.y + jit(i + 7))),
    s: Math.round(slot.s + jit(i + 3) * 0.5),
  }));
}

// 4-colour reveal palette, ordered lightest → deepest — drives the radial ripple
// transition. Derived from the dish's own palette so it stays hue-coherent.
function revealPalette(palette) {
  const uniq = [...new Set((palette || []).filter(Boolean))];
  const byLight = uniq.sort((a, b) => luminance(b) - luminance(a)); // lightest → deepest
  if (byLight.length >= 4) {
    const n = byLight.length - 1;
    return [byLight[0], byLight[Math.round(n * 0.4)], byLight[Math.round(n * 0.72)], byLight[n]];
  }
  const out = [...byLight];
  while (out.length < 4) out.push(out[out.length - 1] || '#14140f');
  return out;
}

export const ITEMS = RAW.map((d) => ({
  ...d,
  sub: d.tagline,
  blobs: vesselBlobs(d),
  reveal: revealPalette(d.palette),
}));

export const MENU = { categories: CATEGORIES, items: ITEMS };

export function findItem(id) {
  return ITEMS.find((i) => i.id === id);
}

// "What's hot" — the crowd-pleasers shown on Home.
export const HOT = [1, 2, 4];
