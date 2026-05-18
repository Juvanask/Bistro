import { Router } from 'express';
import { MENU } from '../data/menu.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json(MENU);
});

export default router;
