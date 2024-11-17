import Post from '../../models/post.model.js';
import pagination from '../../../../helpers/pagination.js';
import search from '../../../../helpers/search.js';
import filterStatus from '../../../../helpers/filterStatus.js';
import User from '../../models/user.model.js';
const controller = {

    /* [GET] api/v1/admin/posts */
    index: async (req, res) => {
        const filterStatusList = filterStatus(req.query);
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
        const initPagination = {
            currentPage: 1,
            limitItems: 6,
        };
        const countPosts = await Post.countDocuments(find);
        const objectPagination = pagination(
            initPagination,
            req.query,
            countPosts
        );

        const sort = {};
        if(req.query.sortKey && req.query.sortValue) {
            sort[req.query.sortKey] = req.query.sortValue;
        } else {
            sort.position = "desc";
            sort.createdAt = "desc";
        }
        //End Sort
        const posts = await Post.find(find)
            .sort(sort)
            .limit(objectPagination.limitItems)
            .skip(objectPagination.skip)
            .populate('post_category_id', 'title')
            .populate('event_id')
            .lean();

        for(const post of posts) {
            const user = await User.findOne({ _id: post.createdBy.account_id });

            if(user) {
                post.accountFullName = user.fullName;
            }
            const updatedBy = post.updatedBy.slice(-1)[0];
            if(updatedBy) {
                const userUpdated = await User.findOne(
                    {
                        _id: updatedBy.account_id
                    }
                );
                updatedBy.accountFullName = userUpdated.fullName;
            }
        }
        res.json({
            success: true,
            data: {
                posts: posts,
                filterStatus: filterStatusList,
                keyword: objectSearch.keyword,
                pagination: objectPagination,
            },
        });
    },

    /* [GET] api/v1/admin/posts/detail/:id */
    detail: async (req, res) => {
        const id = req.params.id;
        const post = await Post.findOne({
            _id: id,
            deleted: false,
        })
            .populate('post_category_id', 'title')
            .populate('event_id');
        res.json({
            success: true,
            message: 'Lấy chi tiết bài viết thành công.',
            data: post,
        });
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
            switch(key) {
                case "status":
                    await Post.updateMany({
                        _id: { $in: ids }
                    }, {
                        status: value
                    });
                    return res.status(200).json({
                        code: 200,
                        message: "Cập nhật trạng thái thành công"
                    });
                case "delete":
                    await Post.updateMany({
                        _id: { $in: ids }
                    }, {
                        deleted: true,
                        deletedAt: new Date()
                    });
                    return res.status(200).json({
                        code: 200,
                        message: "Xóa thành công"
                    });
                default:
                    return res.status(400).json({
                        code: 400,
                        message: "Không tồn tại"
                    });
            }
        } catch(error) {
            console.error(error);
            return res.status(500).json({
                code: 500,
                message: "Cập nhật trạng thái thất bại"
            });
        }
    },

    /* [POST] api/v1/admin/posts */
    createPost: async (req, res) => {
        try {
            if(req.body.position === '' || isNaN(req.body.position)) {
                const countPosts = await Post.countDocuments();
                req.body.position = countPosts + 1;
            } else {
                req.body.position = parseInt(req.body.position);
            }

            req.body.createdBy = { account_id: res.locals.user.id };

            const post = new Post(req.body);
            const data = await post.save();

            res.status(200).json({
                code: 200,
                message: "Tạo bài viết thành công",
                data: data,
            });
        } catch(error) {
            console.error("Lỗi khi tạo bài viết:", error);
            res.status(400).json({
                code: 400,
                message: error.message || "Lỗi khi tạo bài viết. Vui lòng thử lại.",
            });
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
    delete: async (req, res) => {
        try {
            const id = req.params.id;
            await Post.updateOne({
                _id: id,
            }, {
                deleted: true,
                deletedAt: new Date()
            });
            res.json({
                code: 200,
                message: "Xóa thành công"
            })
        } catch(error) {
            res.json({
                code: 400,
                message: "Lỗi"
            })
        }
    },

}
export default controller;