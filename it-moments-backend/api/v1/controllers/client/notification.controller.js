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
    }
}

export default controller;