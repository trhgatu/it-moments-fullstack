import Post from '../../models/post.model.js';
import pagination from '../../../../helpers/pagination.js';
import search from '../../../../helpers/search.js';
const controller = {

    /* [GET] api/v1/admin/posts */
    index: async (req, res) => {
        const find = {
            deleted: false
        }
        if(req.query.status) {
            find.status = req.query.status;
        }
        const objectSearch = search(req.query);

        if(req.query.keyword) {
            find.title = objectSearch.regex;
        }

        // Pagination
        let initPaginagtion = {
            currentPage: 1,
            limitItem: 2,
        };
        const countPosts = await Post.countDocuments(find);
        const objectPagination = pagination(
            initPaginagtion,
            req.query,
            countPosts
        );
        //end Pagination

        //Sort
        const sort = {}

        if(req.query.sortKey && req.query.sortValue) {
            sort[req.query.sortKey] = req.query.sortValue;
        }
        //End Sort

        const posts = await Post.find(find).sort(sort)
            .limit(objectPagination.limitItems)
            .skip(objectPagination.skip);


        res.json(posts);
    },

    /* [GET] api/v1/admin/posts/detail/:id */
    detail: async (req, res) => {
        const id = req.params.id;
        const post = await Post.findOne({
            _id: id,
            deleted: false,
        })
        console.log(post);
        res.json(post);
    },
    /* [PATCH] api/v1/admin/posts/detail/:id */
    changeStatus: async (req, res) => {
        try {
            const id = req.params.id;

            const status = req.body.status;

            await Post.updateOne({
                _id: id
            }, {
                status: status
            });

            res.json({
                code: 200,
                message: "Cập nhật trạng thái thành công"
            });
        } catch(error) {
            res.json({
                code: 404,
                message: "Cập nhật trạng thái thất bại"
            });
        }

    }

}
export default controller;