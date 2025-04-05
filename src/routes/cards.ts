import { Router } from 'express';
import { CardController } from '../controllers/cardController';

const router = Router();

router.post('/consult', CardController.getCardsByName);

export default router;
