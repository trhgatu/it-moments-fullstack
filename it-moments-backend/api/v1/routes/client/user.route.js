import express from 'express';
import controller from '../../controllers/client/user.controller.js'
import { loginPost } from '../../validates/auth.validate.js';

import { requireAuth } from '../../middlewares/auth.middleware.js';
const router = express.Router();

router.post('/register', controller.register);

router.post('/login', loginPost, controller.login);

router.post('/password/forgot', controller.forgotPassword);

router.post('/password/otp', controller.otpPassword);

router.post('/password/reset', controller.resetPassword);

router.get('/detail', requireAuth, controller.detail);


export default router;
