import { Router } from 'express';
import chatRoomController from '../controllers/chatRoom.controller';

const router = Router();

router.post('/', chatRoomController.createChatRoom);
router.get('/', chatRoomController.showChatRoomsList);
router.get('/:id', chatRoomController.showChatRoomById);

export default router;
