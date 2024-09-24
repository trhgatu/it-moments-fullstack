import express from 'express';
import controller from '../../controllers/client/user.controller.js'
import { loginPost } from '../../validates/auth.validate.js';
const router = express.Router();

router.post('/register', controller.register);

router.post('/login', loginPost, controller.login);

router.post('/password/forgot', controller.forgotPassword);

router.post('/password/otp', controller.otpPassword);

router.post('/password/reset', controller.resetPassword);

router.get('/detail', controller.detail);


export default router;
