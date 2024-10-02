import Post from '../../models/post.model.js';

const controller = {

    /* [GET] api/v1/posts */
    index: async (req, res) => {
        const find = {
            deleted: false
        }
        if(req.query.status){
            find.status = req.query.status;
        }
        //Sort
        const sort = {}

        if(req.query.sortKey && req.query.sortValue){
            sort[req.query.sortKey] = req.query.sortValue;
        }
        //End Sort
        const posts = await Post.find(find);
        res.json(posts);
    },

    /* [GET] api/v1/posts/detail/:id */
    detail: async (req, res) => {
        const id = req.params.id;
        const post = await Post.findOne({
            _id: id,
            deleted: false,
        })
        res.json(post);
    }
}
export default controller;