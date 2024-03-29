import { Router } from 'express';
import userController from '../controllers/user.controller';

const router = Router();

router.post('/', userController.createUser);
router.get('/:userName', userController.findUserByUserName);

export default router;
