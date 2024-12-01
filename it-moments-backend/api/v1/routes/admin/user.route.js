import express from "express";
import multer from 'multer';
import { upload } from '../../middlewares/uploadCloud.middleware.js';
const uploadMulter = multer();
const router = express.Router();
import controller from '../../controllers/admin/user.controller.js';


router.get('/', controller.index);

router.post('/create',
    uploadMulter.fields([
        { name: 'avatar', maxCount: 1 },
    ]),
    upload,
    controller.createPost
);
router.get('/detail/:id', controller.detail)
router.delete('/delete/:id', controller.delete)
router.patch('/edit/:id',
    uploadMulter.fields([
        { name: 'avatar', maxCount: 1 },
    ]),
    upload,
    controller.editUser
);


export default router;