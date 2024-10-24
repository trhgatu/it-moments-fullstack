import express from 'express';
import controller from '../../controllers/client/auth.controller.js';
import { loginPost } from '../../validates/auth.validate.js';

const router = express.Router();


router.post('/login', loginPost, controller.login);
router.post('/register', controller.register);
router.post('/refresh_token',controller.refreshToken);


export default router;
