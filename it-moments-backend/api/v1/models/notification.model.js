import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    avatar: { type: String, default: '' }
});

const Notification = mongoose.model('Notification', notificationSchema, 'notifications');

export default Notification;
