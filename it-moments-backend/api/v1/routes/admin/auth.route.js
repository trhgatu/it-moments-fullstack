import express from 'express';
import controller from '../../controllers/admin/auth.controller.js';
import { loginPost } from '../../validates/auth.validate.js';

const router = express.Router();


router.post('/login', loginPost, controller.login);
router.post('/verify-token', controller.verifyToken);
/* router.get('/get-current-user', controller.getCurrentUser); */
export default router;
