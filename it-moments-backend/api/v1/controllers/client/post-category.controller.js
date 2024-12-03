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
        const find = { deleted: false };
        const parentId = req.query.parent_id;

        // Nếu có parent_id, lọc theo parent_id
        if (parentId && mongoose.Types.ObjectId.isValid(parentId)) {
            find.parent_id = parentId;
        }

        // Lấy danh sách các danh mục
        const categories = await PostCategory.find(find).lean();

        const categoryId = req.query.category_id;
        let posts = [];

        if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
            posts = await Post.find({ post_category_id: categoryId, deleted: false }).lean();
        } else if (parentId && mongoose.Types.ObjectId.isValid(parentId)) {
            const childCategories = await PostCategory.find({ parent_id: parentId }).lean();
            const childCategoryIds = childCategories.map(category => category._id);
            posts = await Post.find({ post_category_id: { $in: childCategoryIds }, deleted: false }).lean();
        } else {
            posts = await Post.find({ deleted: false }).lean();
        }
        const getAllChildCategories = async (categoryId) => {
            const childCategories = await PostCategory.find({ parent_id: categoryId }).lean();
            let allChildCategories = [...childCategories];

            for (let childCategory of childCategories) {
                const grandChildCategories = await getAllChildCategories(childCategory._id);
                allChildCategories = [...allChildCategories, ...grandChildCategories];
            }

            return allChildCategories;
        };

        const getCategoryPostCount = async (categoryId) => {
            const allChildCategories = await getAllChildCategories(categoryId);
            const allCategoryIds = [categoryId, ...allChildCategories.map(category => category._id)];


            const postCount = await Post.countDocuments({
                post_category_id: { $in: allCategoryIds },
                deleted: false
            });

            return postCount;
        };

        const categoriesWithPostCount = await Promise.all(categories.map(async (category) => {
            const postCount = await getCategoryPostCount(category._id);
            category.postCount = postCount;
            return category;
        }));
        res.json({
            success: true,
            data: {
                categories: categoriesWithPostCount,
            },
        });
    } catch (error) {
        console.error("Error fetching post categories:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
},

};

export default controller;
