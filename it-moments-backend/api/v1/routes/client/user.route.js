import express from 'express';
import controller from '../../controllers/client/user.controller.js';
import { requireClientAuth } from '../../middlewares/auth.middleware.js';
const router = express.Router();


router.get('/me', requireClientAuth, controller.getUserInfo);
router.put('/update/:id', requireClientAuth, controller.updateUserInfo);

export default router;
