import express from 'express';
import controller from '../../controllers/admin/post-category.controller.js';
import multer from 'multer';
import { upload } from '../../middlewares/uploadCloud.middleware.js';
const uploadMulter = multer();
const router = express.Router();

router.get('/', controller.index);

router.get('/detail/:id', controller.detail);

/* router.patch('/change-status/:id', controller.changeStatus);

router.patch('/change-status-multi', controller.changeMulti);
 */

/*
router.patch('/edit/:id', controller.editPatch);

router.delete('/delete/:id', controller.delete); */

export default router;
