import express from "express";
import multer from 'multer';
import { upload } from '../../middlewares/uploadCloud.middleware.js';
const uploadMulter = multer();
const router = express.Router();
import controller from '../../controllers/admin/user.controller.js';


router.get('/', controller.index);

router.post('/create',
    uploadMulter.single("avatar"),
    upload,
    controller.createPost
);
router.get('/detail/:id', controller.detail)
router.delete('/delete/:id', controller.delete)

export default router;