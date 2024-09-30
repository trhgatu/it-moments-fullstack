import express from 'express';
import controller from '../../controllers/admin/user.controller.js'

const router = express.Router();

router.get('/', controller.index);

export default router;
