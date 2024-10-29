import express from 'express';
import controller from '../../controllers/admin/post-category.controller.js';
import multer from 'multer';
import { upload } from '../../middlewares/uploadCloud.middleware.js';
const uploadMulter = multer();
const router = express.Router();

router.get('/', controller.index);

router.get('/detail/:id', controller.detail);

router.post('/create',
    uploadMulter.fields([
        { name: 'thumbnail', maxCount: 1 },
    ]),
    upload,
    controller.createPost
);

export default router;
