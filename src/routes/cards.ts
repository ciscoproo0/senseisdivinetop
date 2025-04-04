import { Router, Request, Response } from 'express';
import { getCardsByName } from '../services/cardService';

const router = Router();

router.post('/consult', async (req: Request, res: Response): Promise<any> => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name field is required in body' });
  }

  try {
    const cards = await getCardsByName(name);
    return res.json({ cards });
  } catch (error) {
    console.error('Error fetching cards:', error);
    return res.status(500).json({ message: 'Error fetching cards' });
  }
});

export default router;
