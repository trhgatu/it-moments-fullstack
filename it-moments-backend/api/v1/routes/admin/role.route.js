import express from "express"
import controller from '../../controllers/admin/role.controller.js';
import multer from 'multer';
const uploadMulter = multer();
const router = express.Router();



router.get('/', controller.index);

router.post('/create', uploadMulter.none(), controller.createPost);

router.get('/permissions', controller.permissions);

router.patch('/permissions', controller.permissionsPatch);

router.delete('/:id', controller.deleteRole);

router.get('/detail/:id', controller.detail);

router.patch('/edit/:id', controller.editRole);

export default router;