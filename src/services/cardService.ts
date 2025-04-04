import { redisClient } from '../app';
import axios from 'axios';

export async function getCardsByName(name: string): Promise<any> {
  const cacheKey = `cards:${name.toLowerCase()}`;

  // Primeiro tenta pegar do cache
  const cachedCards = await redisClient.get(cacheKey);
  if (cachedCards) {
    console.log('Cache hit');
    return JSON.parse(cachedCards);
  }

  try {
    console.log('Cache miss, fetching from external API');

    // Faz chamada pra API da Scryfall (API pública de cartas)
    const response = await axios.get<{ data: { data: any[] } }>(`https://api.scryfall.com/cards/search`, {
      params: {
        q: name
      }
    });

    const cards = response.data.data;

    // Salva no Redis por 1 hora
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(cards));

    return cards;
  } catch (error) {
    console.error('Error fetching from Scryfall API:', error);
    throw new Error('Failed to fetch cards from external API');
  }
}
