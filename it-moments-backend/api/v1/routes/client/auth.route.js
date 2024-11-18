import express from 'express';
import controller from '../../controllers/client/auth.controller.js';
import { loginPost } from '../../validates/auth.validate.js';
import { requireClientAuth } from '../../middlewares/auth.middleware.js';
const router = express.Router();


router.post('/login', loginPost, controller.login);

router.post('/logout', controller.logout);

router.post('/register', controller.register);

router.get('/verify', controller.verifyEmail);


export default router;
