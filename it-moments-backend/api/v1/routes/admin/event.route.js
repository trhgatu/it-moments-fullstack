import express from 'express';
import controller from '../../controllers/admin/event.controller.js';
import multer from 'multer';
const router = express.Router();

router.get('/', controller.index);
router.post('/create',
    controller.createEvent
);
router.get('/detail/:id', controller.detail);
export default router;