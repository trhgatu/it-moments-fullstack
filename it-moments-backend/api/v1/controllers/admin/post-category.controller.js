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
    /* [POST] api/v1/admin/post-categories/create */
    createPost: async (req, res) => {

        if(req.body.position == '') {
            const count = await PostCategory.countDocuments();
            req.body.position = count + 1;
        } else {
            req.body.position = parseInt(req.body.position);
        }
        req.body.createdBy = {
            account_id: res.locals.user.id,
        };

        try {
            const category = new PostCategory(req.body);
            const data = await category.save();

            res.json({
                code: 200,
                message: "Tạo thành công",
                data: data,
            });
        } catch(error) {
            console.error("Lỗi khi tạo bài viết:", error);
            res.json({
                code: 400,
                message: "Lỗi khi tạo bài viết. Vui lòng thử lại.",
            });
        }


        res.status(201).json({
            success: true,
            message: 'Tạo danh mục bài viết thành công.',
            data: newCategory,
        });

        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi tạo danh mục.',
            error: error.message,
        });
    }
}
export default controller;