import Post from '../../models/post.model.js';
import Event from '../../models/event.model.js';
import PostCategory from '../../models/post-category.model.js';
import pagination from '../../../../helpers/pagination.js';
import search from '../../../../helpers/search.js';
import filterStatus from '../../../../helpers/filterStatus.js';
import User from '../../models/user.model.js';
import Role from '../../models/role.model.js';
const controller = {

    /* [GET] api/v1/posts */
    index: async (req, res) => {
        const filterStatusList = filterStatus(req.query);
        const find = { deleted: false };

        if(req.query.status) {
            find.status = req.query.status;
        }
        const objectSearch = search(req.query);

        if(req.query.keyword) {
            find.title = objectSearch.regex;
        }

        if(req.query.category) {
            const category = await PostCategory.findOne(
                {
                    slug: req.query.category
                }
            );
            if(category) {
                find.post_category_id = category._id;
            } else {
                return res.status(404).json({
                    success: false,
                    message: `Danh mục ${req.query.category} không tồn tại`,
                });
            }
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

        // Sort
        const sort = {};
        if(req.query.sortKey && req.query.sortValue) {
            sort[req.query.sortKey] = req.query.sortValue;
        } else {
            sort.position = "desc";
            sort.createdAt = "desc";
        }

        // Fetch posts with applied filters
        const posts = await Post.find(find)
            .sort(sort)
            .limit(objectPagination.limitItems)
            .skip(objectPagination.skip)
            .populate('post_category_id', 'title')
            .populate('event_id', 'title')
            .lean();

        for(const post of posts) {
            const user = await User.findOne({ _id: post.createdBy.account_id });
            if(user) {
                post.accountFullName = user.isAdmin ? "Admin" : user.fullName;
            }
            const updatedBy = post.updatedBy.slice(-1)[0];
            if(updatedBy) {
                const userUpdated = await User.findOne({ _id: updatedBy.account_id });
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
    /* [GET] api/v1/posts/detail/:slug */
    detail: async (req, res) => {
        const slug = req.params.slug;
        const find = {
            slug: slug,
            deleted: false,
        }
        const post = await Post.findOne(find)
            .populate("post_category_id", "title")
            .populate("event_id", "title")
        res.json(post);
    }
}
export default controller;