import express from 'express';
import controller from '../../controllers/client/user.controller.js';
import { requireClientAuth } from '../../middlewares/auth.middleware.js';
import multer from 'multer';
import { upload } from '../../middlewares/uploadCloud.middleware.js';
const uploadMulter = multer();
const router = express.Router();


router.get('/me', requireClientAuth, controller.getUserInfo);
router.put('/update/:id',
    uploadMulter.fields([
        { name: 'avatar', maxCount: 1 },
    ]),
    upload, requireClientAuth, controller.updateUserInfo);

export default router;
