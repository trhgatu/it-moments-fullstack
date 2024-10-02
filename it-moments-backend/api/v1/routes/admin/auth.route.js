import express from 'express';
import controller from '../../controllers/admin/auth.controller.js';
import { loginPost } from '../../validates/auth.validate.js';

const router = express.Router();


router.post('/login', loginPost, controller.login);
router.post('/register', loginPost, controller.register);
router.post('/verify-token', controller.verifyToken);

export default router;
