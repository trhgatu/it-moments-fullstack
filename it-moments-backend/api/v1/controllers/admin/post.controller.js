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
    /* [PATCH] api/v1/admin/posts/change-status/:id */
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

    },
    changeMulti: async (req, res) => {
        try {
            const { ids, key, value } = req.body;
            console.log(ids)
            console.log(key)
            console.log(value)

            switch(key) {
                case "status":
                    await Post.updateMany({
                        _id: { $in: ids }
                    }, {
                        status: value
                    });
                    res.json({
                        code: 200,
                        message: "Cập nhật trạng thái thành công"
                    });
                    break;
                default:
                    res.json({
                        code: 404,
                        message: "Không tồn tại"
                    });
                    break;
            }
        } catch(error) {
            res.json({
                code: 404,
                message: "Cập nhật trạng thái thất bại"
            });
        }

    },
    createPost: async (req, res) => {
        try {
            const post = new Post(req.body);
            const data = await post.save();

            res.json({
                code: 200,
                message: "Tạo thành công",
                data: data
            })
        } catch(error) {
            res.json({
                code: 400,
                message: "Lỗi",
            })
        }
    },
    editPatch: async (req, res) => {
        try {
            const id = req.params.id;
            await Post.updateOne({
                _id: id,

            },
                req.body
            );

            res.json({
                code: 200,
                message: "Cập nhật thành công",
            })
        } catch(error) {
            res.json({
                code: 400,
                message: "Lỗi",
            })
        }
    },

}
export default controller;