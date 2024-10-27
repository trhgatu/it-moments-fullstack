import mongoose from "mongoose";
import slug from 'mongoose-slug-updater';

mongoose.plugin(slug);
const postSchema = new mongoose.Schema({
    title: String,
    post_category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PostCategory',
    },
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
    },
    description: String,
    views: {
        type: Number,
        default: 0
    },
    thumbnail: String,
    video: String,
    status: String,
    position: Number,
    images: [String],

    slug: {
        type: String,
        slug: "title",
        unique: true
    },
    createdBy: {
        account_id: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedBy: {
        account_id: String,
        deletedAt: Date
    },
    updatedBy: [
        {
            account_id: String,
            updatedAt: Date
        }
    ],
},
{
    timestamps: true,
});
const Post = mongoose.model('Post', postSchema, 'posts');

export default Post;