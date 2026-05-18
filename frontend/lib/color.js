// Tiny hex color helpers for the SVG sphere shading.

function clamp(n) {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function parse(hex) {
  let h = (hex || '#000000').replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function toHex([r, g, b]) {
  return '#' + [r, g, b].map((n) => clamp(n).toString(16).padStart(2, '0')).join('');
}

export function lighten(hex, amt = 0.3) {
  const [r, g, b] = parse(hex);
  return toHex([r + (255 - r) * amt, g + (255 - g) * amt, b + (255 - b) * amt]);
}

export function darken(hex, amt = 0.3) {
  const [r, g, b] = parse(hex);
  return toHex([r * (1 - amt), g * (1 - amt), b * (1 - amt)]);
}

export function withAlpha(hex, a = 1) {
  const [r, g, b] = parse(hex);
  return `rgba(${r},${g},${b},${a})`;
}

// Perceived luminance, 0 (black) → 1 (white).
export function luminance(hex) {
  const [r, g, b] = parse(hex);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}
