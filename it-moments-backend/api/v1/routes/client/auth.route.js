import express from 'express';
import controller from '../../controllers/client/auth.controller.js';
import { loginPost, validateRegister, validateResetPassword, validateForgotPassword } from '../../validates/auth.validate.js';
import { requireClientAuth } from '../../middlewares/auth.middleware.js';
const router = express.Router();


router.post('/login', loginPost, controller.login);

router.post('/logout', controller.logout);

router.post('/register', validateRegister, controller.register);

router.get('/verify', controller.verifyEmail);

router.post('/forgot-password', validateForgotPassword, controller.forgotPassword);

router.post('/reset-password', validateResetPassword, controller.resetPassword);


export default router;
