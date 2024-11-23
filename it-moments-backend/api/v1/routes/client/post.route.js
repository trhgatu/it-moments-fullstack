import express from 'express';
import controller from '../../controllers/client/post.controller.js';
import { requireClientAuth } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// Các route hiện tại
router.get('/', controller.index);

router.get('/detail/:slug', controller.detail);

router.post('/:id/vote', requireClientAuth, controller.vote);

router.post('/:id/cancel-vote', requireClientAuth, controller.cancelVote);

router.get('/lastestPost', controller.lastestPost);

router.post('/:id/like', requireClientAuth, controller.likePost);

router.post('/:id/comment', requireClientAuth, controller.commentPost);

router.get('/:id/comments', controller.getComments);

router.delete('/:id/comment/:commentId', requireClientAuth, controller.deleteComment);

router.post('/:id/comment/reply', requireClientAuth, controller.replyToComment);

router.post('/:id/increment-views', controller.incrementViews);

export default router;
