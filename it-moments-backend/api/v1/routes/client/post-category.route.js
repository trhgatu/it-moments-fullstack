import express from 'express';
import controller from '../../controllers/client/post-category.controller.js';
import multer from 'multer';
import { upload } from '../../middlewares/uploadCloud.middleware.js';
const uploadMulter = multer();
const router = express.Router();

router.get('/', controller.index);


export default router;
