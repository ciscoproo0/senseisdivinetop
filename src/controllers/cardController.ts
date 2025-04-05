import { Request, Response } from 'express';
import { getCardsByName } from '../services/cardService';

export class CardController {
  static async getCardsByName(req: Request, res: Response): Promise<any> {
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
  }
}