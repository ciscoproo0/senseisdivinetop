import express from 'express';
import dotenv from 'dotenv';
import { createClient } from 'redis';
import cardsRouter from './routes/cards';
import { authMiddleware } from './middlewares/authMiddleware';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Redis client
export const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT)
  },
  password: process.env.REDIS_PASSWORD || undefined
});

redisClient.connect()
  .then(() => console.log('Connected to Redis'))
  .catch((err) => console.error('Redis connection error:', err));

app.use(express.json());

// Middleware para validar JWT
app.use(authMiddleware);

// Rotas
app.use('/', cardsRouter);

app.listen(port, () => {
  console.log(`Sensei Divine Top server running on port ${port}`);
});
