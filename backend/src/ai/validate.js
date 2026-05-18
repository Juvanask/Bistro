import { z } from 'zod';
import { findItem } from '../data/menu.js';

const ModSchema = z
  .object({
    spice: z.string().optional(),
    size: z.string().optional(),
    doneness: z.string().optional(),
    addons: z.array(z.string()).optional(),
    note: z.string().optional(),
  })
  .partial()
  .optional();

const ActionSchema = z.object({
  type: z.enum(['add', 'remove', 'modify', 'clear', 'suggest']),
  item_id: z.number().int().positive().optional().nullable(),
  line_id: z.string().optional().nullable(),
  qty: z.number().int().positive().max(20).optional().nullable(),
  modifiers: ModSchema,
});

// Drop nonsense actions, normalize fields, return only what the menu can satisfy.
export function validateActions(actions = []) {
  const out = [];
  for (const raw of actions) {
    const parsed = ActionSchema.safeParse(raw);
    if (!parsed.success) continue;
    const a = parsed.data;

    if (a.type === 'add' || a.type === 'suggest') {
      if (!a.item_id || !findItem(a.item_id)) continue;
      out.push({
        type: a.type,
        item_id: a.item_id,
        qty: a.qty ?? 1,
        modifiers: a.modifiers ?? {},
      });
    } else if (a.type === 'remove') {
      if (a.line_id) out.push({ type: 'remove', line_id: a.line_id });
      else if (a.item_id && findItem(a.item_id)) out.push({ type: 'remove', item_id: a.item_id });
    } else if (a.type === 'modify') {
      if (!a.line_id) continue;
      out.push({ type: 'modify', line_id: a.line_id, modifiers: a.modifiers ?? {} });
    } else if (a.type === 'clear') {
      out.push({ type: 'clear' });
    }
  }
  return out;
}
