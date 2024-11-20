import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    avatar: { type: String, default: '' },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    commentId: { type: mongoose.Schema.Types.ObjectId, required: false },
    postCategorySlug: { type: String, required: true },
    postSlug: { type: String, required: true },
});

const Notification = mongoose.model('Notification', notificationSchema, 'notifications');

export default Notification;
