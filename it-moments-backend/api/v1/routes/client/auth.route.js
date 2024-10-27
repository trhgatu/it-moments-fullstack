import express from 'express';
import controller from '../../controllers/client/auth.controller.js';
import { loginPost } from '../../validates/auth.validate.js';
import { requireClientAuth } from '../../middlewares/auth.middleware.js';
const router = express.Router();


router.post('/login', loginPost, controller.login);
router.post('/register', controller.register);
router.get('/verify', controller.verifyEmail);
router.post('/refresh_token',controller.refreshToken);
router.get('/me', requireClientAuth, controller.me);

export default router;
