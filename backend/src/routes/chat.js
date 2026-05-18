import { Router } from 'express';
import { parseOrder } from '../ai/gemini.js';
import { validateActions } from '../ai/validate.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { messages = [], cart = [], context = {} } = req.body || {};
    const result = await parseOrder({ messages, cart, context });
    const actions = validateActions(result.actions);
    res.json({
      reply: result.reply,
      actions,
      context: { last_item_ref: result.last_item_ref || context.last_item_ref || null },
    });
  } catch (err) {
    console.error('[chat] error:', err);
    res.status(500).json({
      reply: 'Sorry, I had trouble there — try again?',
      actions: [],
      context: {},
    });
  }
});

export default router;
