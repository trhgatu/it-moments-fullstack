import express from 'express';
import controller from '../controllers/user.controller.js'
import { loginPost } from '../validates/auth.validate.js'
const router = express.Router();

router.post('/register', controller.register);
router.post('/login', loginPost, controller.login);
export default router;
