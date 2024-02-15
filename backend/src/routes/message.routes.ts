import { Router } from 'express';
import messageController from '../controllers/message.controller';

const router = Router();

router.post('/', messageController.addMessage);
router.get('/:chatId', messageController.listMessagesByChatId);

export default router;
