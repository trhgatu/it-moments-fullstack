const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
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
    deleted: {
        type: Boolean,
        default: false
    },
    slug:{
        type: String,
        slug: "title",
        unique: true
    },
    deletedAt: Date,
    position: Number,

},{
    timestamps: true
})
const PostCategory = mongoose.model('PostCategory', postCategorySchema, 'posts-category')

export default PostCategory;
