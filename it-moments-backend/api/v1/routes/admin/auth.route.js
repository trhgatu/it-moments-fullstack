import express from 'express';
import controller from '../../controllers/admin/auth.controller.js';
import { loginPost } from '../../validates/auth.validate.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';
const router = express.Router();


router.post('/login', loginPost, controller.login);
router.get('/me', requireAuth, controller.me);
export default router;
