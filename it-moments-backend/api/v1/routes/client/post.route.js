import express from 'express';
import controller from '../../controllers/client/post.controller.js';

const router = express.Router();

router.get('/', controller.index);

router.get('/detail/:id', controller.detail);


export default router;
