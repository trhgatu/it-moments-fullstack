import express from 'express';
import controller from '../../controllers/client/post.controller.js';
import { requireClientAuth } from '../../middlewares/auth.middleware.js';
const router = express.Router();

router.get('/', controller.index);

router.get('/detail/:slug', controller.detail);

router.post('/:id/vote', requireClientAuth, controller.vote);

router.post('/:id/cancel-vote', requireClientAuth, controller.cancelVote);
router.get('/lastestPost', controller.lastestPost);

export default router;
