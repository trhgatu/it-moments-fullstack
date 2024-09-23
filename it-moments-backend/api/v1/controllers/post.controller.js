import Post from '../models/post.model.js';

const controller = {

    /* [GET] api/v1/posts */
    index: async (req, res) => {
        const posts = await Post.find({
            deleted: false
        })
        console.log(posts);
        res.json(posts);
    },

    /* [GET] api/v1/posts/detail/:id */
    detail: async (req, res) => {
        const id = req.params.id;
        const post = await Post.findOne({
            _id: id,
            deleted: false,
        })
        console.log(post);
        res.json(post);
    }
}
export default controller;