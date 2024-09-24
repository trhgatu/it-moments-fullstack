import express from 'express';
import controller from '../../controllers/admin/post.controller.js';

const router = express.Router();

router.get('/', controller.index);

router.get('/detail/:id', controller.detail);

router.patch('/change-status/:id', controller.changeStatus);

router.patch('/change-status-multi', controller.changeMulti);

router.post('/create', controller.createPost);
export default router;
