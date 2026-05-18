import { Router } from 'express';
import { findItem } from '../data/menu.js';

const router = Router();

// Naive order receipt — computes totals and returns a fake order id + ETA.
router.post('/', (req, res) => {
  const { cart = [], tip_pct = 20, table = 14 } = req.body || {};

  let subtotal = 0;
  const lines = [];
  for (const line of cart) {
    const item = findItem(line.item_id);
    if (!item) continue;
    let unit = item.price;
    // size price delta on drinks
    const sizeMod = item.modifiers?.find((m) => m.name === 'size');
    if (sizeMod && line.modifiers?.size && sizeMod.priceDelta) {
      unit += sizeMod.priceDelta[line.modifiers.size] || 0;
    }
    // addon prices
    if (line.modifiers?.addons?.length) {
      const addonMod = item.modifiers?.find((m) => m.name === 'addons');
      for (const a of line.modifiers.addons) {
        const opt = addonMod?.options?.find((o) => o.name === a);
        if (opt) unit += opt.price;
      }
    }
    const total = unit * (line.qty || 1);
    subtotal += total;
    lines.push({ ...line, name: item.name, line_total: total });
  }

  const tax = +(subtotal * 0.085).toFixed(2);
  const tip = +(subtotal * (tip_pct / 100)).toFixed(2);
  const total = +(subtotal + tax + tip).toFixed(2);

  const orderId = 'A-' + Math.floor(1000 + Math.random() * 9000);
  const eta = 12 + Math.floor(Math.random() * 12);

  res.json({
    order_id: orderId,
    table,
    eta_minutes: eta,
    subtotal: +subtotal.toFixed(2),
    tax,
    tip,
    total,
    lines,
    placed_at: new Date().toISOString(),
  });
});

export default router;
