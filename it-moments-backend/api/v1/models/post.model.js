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
        required: false
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
    isFeatured: { type: Boolean, default: false },
    votes: { type: Number, default: 0 },
    voters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likes: [
        {
            user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            likedAt: { type: Date, default: Date.now }
        }
    ],
    comments: [
        {
            user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            content: String,
            createdAt: { type: Date, default: Date.now },
            parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post.comments', required: false },
            replies: [
                {
                    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                    content: String,
                    createdAt: { type: Date, default: Date.now }
                }
            ]
        }
    ],
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
}, {
    timestamps: true,
});
postSchema.methods.isVotingActive = async function () {
    const event = await mongoose.model('Event').findById(this.event_id);
    const now = new Date();
    if (event && event.status === "active" && event.votingStartTime <= now && event.votingEndTime >= now) {
        return true;
    }
    return false;
};

const Post = mongoose.model('Post', postSchema, 'posts');

export default Post;
