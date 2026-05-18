// Bistro design tokens — premium iOS, Léa-led. Cream paper + glass depth + ember AI.

export const FONTS = {
  display: 'InstrumentSerif_400Regular_Italic',
  displayUp: 'InstrumentSerif_400Regular',
  body: 'Geist_400Regular',
  bodyMed: 'Geist_500Medium',
  bodyBold: 'Geist_600SemiBold',
  mono: 'JetBrainsMono_400Regular',
  monoMed: 'JetBrainsMono_500Medium',
};

export const RADIUS = { sm: 10, md: 16, lg: 22, xl: 28, full: 999 };

// Léa accent palettes — warm ember (default), olive, plum.
export const ACCENTS = {
  ember: { l1: '#ffb87a', l2: '#ff7a4d', l3: '#c2422a', l4: '#6a1810' },
  olive: { l1: '#c8d68a', l2: '#7a9a3f', l3: '#3a5020', l4: '#1a2810' },
  plum:  { l1: '#e3a6c4', l2: '#a85580', l3: '#6a2848', l4: '#3a1424' },
};

const LIGHT = {
  bg: '#f4efe6',
  bg2: '#ebe3d2',
  bgWarm: '#e9dcc2',
  surface: 'rgba(255,255,255,0.62)',
  surfaceStrong: 'rgba(255,255,255,0.82)',
  surfaceDim: 'rgba(255,255,255,0.35)',
  ink: '#14140f',
  inkSoft: '#3a3a30',
  inkFaint: '#6a6855',
  inkMute: '#97947c',
  hairline: 'rgba(20,20,15,0.10)',
  hairline2: 'rgba(20,20,15,0.06)',
  glassBorder: 'rgba(255,255,255,0.6)',
  blurTint: 'light',
  olive: '#4a5a2e',
  mustard: '#d4a93a',
  tomato: '#c1452f',
  cream: '#faf7ee',
};

const DARK = {
  bg: '#14130f',
  bg2: '#1d1b15',
  bgWarm: '#241f16',
  surface: 'rgba(40,35,26,0.55)',
  surfaceStrong: 'rgba(60,52,38,0.78)',
  surfaceDim: 'rgba(40,35,26,0.34)',
  ink: '#f5eedf',
  inkSoft: '#cfc6b1',
  inkFaint: '#948c79',
  inkMute: '#6f6856',
  hairline: 'rgba(255,245,210,0.12)',
  hairline2: 'rgba(255,245,210,0.06)',
  glassBorder: 'rgba(255,245,210,0.12)',
  blurTint: 'dark',
  olive: '#7a9a4a',
  mustard: '#d4a93a',
  tomato: '#d4593f',
  cream: '#2a261c',
};

export function makeTheme({ dark = false, accent = 'ember' } = {}) {
  const base = dark ? DARK : LIGHT;
  const a = ACCENTS[accent] || ACCENTS.ember;
  return {
    ...base,
    dark,
    accent,
    lea1: a.l1,
    lea2: a.l2,
    lea3: a.l3,
    lea4: a.l4,
  };
}

export const theme = makeTheme();
