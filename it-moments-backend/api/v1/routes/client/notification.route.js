import express from 'express';
import controller from '../../controllers/client/notification.controller.js';
import { requireClientAuth } from '../../middlewares/auth.middleware.js';

const router = express.Router();


router.get('/', requireClientAuth, controller.getNotifications);

router.post('/mark-as-read', requireClientAuth, controller.markNotificationsAsRead);
router.put('/mark-as-read/:notificationId', requireClientAuth, controller.markNotificationAsRead);
router.delete('/delete/:notificationId', requireClientAuth, controller.deleteNotification);
export default router;