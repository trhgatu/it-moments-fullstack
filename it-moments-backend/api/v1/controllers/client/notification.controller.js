import Notification from '../../models/notification.model.js';

const controller = {
    getNotifications: async (req, res) => {
        try {
            const userId = res.locals.user._id;
            const notifications = await Notification.find({ user_id: userId })
            .sort({ createdAt: -1 });
            res.status(200).json({ success: true, data: notifications });
        } catch(error) {
            console.error('Lỗi khi lấy thông báo:', error);
            res.status(500).json({ success: false, message: 'Không thể lấy thông báo.' });
        }
    },
    markNotificationsAsRead: async (req, res) => {
        try {
            const userId = res.locals.user._id;
            await Notification.updateMany({ user_id: userId, read: false }, { read: true });
            res.status(200).json({ success: true, message: 'Đã đánh dấu thông báo là đã đọc.' });
        } catch(error) {
            console.error('Lỗi khi cập nhật thông báo:', error);
            res.status(500).json({ success: false, message: 'Không thể cập nhật thông báo.' });
        }
    },
    markNotificationAsRead: async (req, res) => {
        try {
            const { notificationId } = req.params;
            const userId = res.locals.user._id;
            const notification = await Notification.findOneAndUpdate(
                { _id: notificationId, user_id: userId },
                { $set: { read: true } },
                { new: true }
            );

            if (!notification) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy thông báo' });
            }

            return res.status(200).json({ success: true, message: 'Đã đánh dấu thông báo là đã đọc', data: notification });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
        }
    },
    deleteNotification: async (req, res, next) => {
        const { notificationId } = req.params;
        const userId = res.locals.user._id;
        try {
            const notification = await Notification.findOneAndDelete({
                _id: notificationId,
                user_id: userId
            });

            if (!notification) {
                return res.status(404).json({ success: false, message: 'Thông báo không tồn tại' });
            }

            res.json({ success: true, message: 'Thông báo đã được xóa' });
        } catch (error) {
            console.error('Lỗi khi xóa thông báo:', error);
            next(error);
        }
    },
}

export default controller;