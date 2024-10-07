import mongoose from 'mongoose';
import slug from "mongoose-slug-updater";
mongoose.plugin(slug);

const postCategorySchema = new mongoose.Schema({
    title: String,
    parent_id: {
        type: String,
        default: "",
    },
    description: String,
    thumbnail: String,
    status: String,
    slug:{
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
    deletedAt: Date,
    position: Number,

},{
    timestamps: true
})
const PostCategory = mongoose.model('PostCategory', postCategorySchema, 'posts-category')

export default PostCategory;
