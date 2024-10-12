import express from "express";
import multer from 'multer';
import { upload } from '../../middlewares/uploadCloud.middleware.js';
const uploadMulter = multer();
const router = express.Router();
import controller from '../../controllers/admin/user.controller.js';


router.get('/', controller.index);

/* router.get('/create', controller.create);

router.post('/create',
    uploadMulter.single("avatar"),
    upload,
);

router.get('/edit/:id', controller.edit);

router.patch('/edit/:id',
    upload.single("avatar"),
    upload,
);

router.delete('/delete/:id', controller.deleteItem); */

export default router;