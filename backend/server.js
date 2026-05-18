import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import menuRoutes from './src/routes/menu.js';
import chatRoutes from './src/routes/chat.js';
import orderRoutes from './src/routes/order.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => res.json({ ok: true, service: 'bistro-backend' }));
app.use('/api/menu', menuRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/order', orderRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🍽  Bistro backend listening on :${PORT}`);
  if (!process.env.GEMINI_API_KEY) {
    console.log('   (running in MOCK mode — set GEMINI_API_KEY in .env to enable real AI)');
  }
});
