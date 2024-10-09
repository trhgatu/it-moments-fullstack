import PostCategory from '../../models/post-category.model.js';
import pagination from '../../../../helpers/pagination.js';
import search from '../../../../helpers/search.js';
import filterStatus from '../../../../helpers/filterStatus.js';
import User from '../../models/user.model.js';
const controller = {

    /* [GET] api/v1/admin/post-categories */
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
        const countCategories = await PostCategory.countDocuments(find);
        const objectPagination = pagination(
            initPagination,
            req.query,
            countCategories
        );
        const sort = {}

        if(req.query.sortKey && req.query.sortValue) {
            sort[req.query.sortKey] = req.query.sortValue;
        } else {
            sort.position = "desc";
        }

        //End Sort

        const categories = await PostCategory.find(find)
            .sort(sort)
            .limit(objectPagination.limitItems)
            .skip(objectPagination.skip)
            .lean();

        /* for(const category of categories) {
            const user = await User.findOne({_id: category.createdBy.account_id});

            if(user) {
                category.accountFullName = user.fullName;
            }
            const updatedBy = category.updatedBy.slice(-1)[0];
            if(updatedBy) {
                const userUpdated = await User.findOne(
                    {
                        _id: updatedBy.account_id
                    }
                );
                updatedBy.accountFullName = userUpdated.fullName;
            }
        } */
        res.json({
            success: true,
            data: {
                categories: categories,
                filterStatus: filterStatusList,
                keyword: objectSearch.keyword,
                pagination: objectPagination,
            },
        });
    },

    /* [GET] api/v1/admin/post-categories/detail/:id */
    detail: async (req, res) => {
        const id = req.params.id;
        const category = await PostCategory.findOne({
            _id: id,
            deleted: false,
        })
        res.json({
            success: true,
            message: 'Lấy chi tiết bài viết thành công.',
            data: category,
        });
    },
    /* [PATCH] api/v1/admin/post-categories/change-status/:id */
    changeStatus: async (req, res) => {
        try {
            const id = req.params.id;

            const status = req.body.status;

            await PostCategory.updateOne({
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
                    await PostCategory.updateMany({
                        _id: { $in: ids }
                    }, {
                        status: value
                    });
                    res.json({
                        code: 200,
                        message: "Cập nhật trạng thái thành công"
                    });
                    break;
                case "delete":
                    await PostCategory.updateMany({
                        _id: { $in: ids }
                    }, {
                        deleted: true,
                        deletedAt: new Date()
                    });
                    res.json({
                        code: 200,
                        message: "Xóa thành công"
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

    editPatch: async (req, res) => {
        try {
            const id = req.params.id;
            await PostCategory.updateOne({
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
            await PostCategory.updateOne({
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