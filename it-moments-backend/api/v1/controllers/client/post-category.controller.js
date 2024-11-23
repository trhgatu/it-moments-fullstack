import PostCategory from '../../models/post-category.model.js';
import Post from '../../models/post.model.js'; // Mô hình bài viết
import pagination from '../../../../helpers/pagination.js';
import search from '../../../../helpers/search.js';
import filterStatus from '../../../../helpers/filterStatus.js';
import User from '../../models/user.model.js';
import mongoose from 'mongoose';

const controller = {

    /* [GET] api/v1/post-categories */
    index: async (req, res) => {
        try {
            // Lấy danh sách trạng thái để lọc
            const filterStatusList = filterStatus(req.query);

            // Điều kiện tìm kiếm cơ bản
            const find = { deleted: false };

            // Lọc theo parent_id nếu có
            const parentId = req.query.parent_id;
            if (parentId && mongoose.Types.ObjectId.isValid(parentId)) {
                find.parent_id = parentId;
            }

            // Tìm kiếm theo từ khóa trong title
            const objectSearch = search(req.query);
            if (req.query.keyword) {
                find.title = objectSearch.regex;
            }

            // Phân trang
            const initPagination = {
                currentPage: 1,
                limitItems: 10, // Tăng số lượng danh mục trả về mặc định
            };

            const countCategories = await PostCategory.countDocuments(find);
            const objectPagination = pagination(
                initPagination,
                req.query,
                countCategories
            );

            // Sắp xếp
            const sort = {};
            if (req.query.sortKey && req.query.sortValue) {
                sort[req.query.sortKey] = req.query.sortValue;
            } else {
                sort.position = "desc"; // Sắp xếp theo vị trí giảm dần
                sort.createdAt = "desc"; // Nếu bằng nhau, sắp xếp theo thời gian
            }

            // Lấy danh sách danh mục
            const categories = await PostCategory.find(find)
                .sort(sort)
                .limit(objectPagination.limitItems)
                .skip(objectPagination.skip)
                .lean();

            // Thêm thông tin người tạo và cập nhật gần nhất
            for (const category of categories) {
                // Lấy thông tin người tạo
                const user = await User.findOne({ _id: category.createdBy.account_id });
                if (user) {
                    category.accountFullName = user.fullName;
                }

                // Lấy thông tin người cập nhật gần nhất
                const updatedBy = category.updatedBy?.slice(-1)[0];
                if (updatedBy) {
                    const userUpdated = await User.findOne({ _id: updatedBy.account_id });
                    if (userUpdated) {
                        updatedBy.accountFullName = userUpdated.fullName;
                    }
                }
            }

            // Lọc bài viết theo danh mục
            const categoryId = req.query.category_id; // Lấy category_id từ query
            let posts = [];

            if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
                // Lọc bài viết theo category_id nếu có
                posts = await Post.find({ category: categoryId, deleted: false }).lean();
            } else if (parentId && mongoose.Types.ObjectId.isValid(parentId)) {
                // Nếu có parent_id, lấy tất cả các danh mục con của danh mục cha
                const childCategories = await PostCategory.find({ parent_id: parentId }).lean();
                const childCategoryIds = childCategories.map(category => category._id);

                // Lọc bài viết từ danh mục cha và tất cả các danh mục con
                posts = await Post.find({ category: { $in: childCategoryIds }, deleted: false }).lean();
            } else {
                // Nếu không có category_id và parent_id, lấy tất cả bài viết
                posts = await Post.find({ deleted: false }).lean();
            }

            // Trả về dữ liệu
            res.json({
                success: true,
                data: {
                    categories: categories,
                    filterStatus: filterStatusList,
                    posts: posts,
                    keyword: objectSearch.keyword,
                    pagination: objectPagination,
                },
            });
        } catch (error) {
            console.error("Error fetching post categories:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },

};

export default controller;
