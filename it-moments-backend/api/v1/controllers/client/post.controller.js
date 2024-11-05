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
        if(req.query.isFeatured === 'true') {
            find.isFeatured = true;
        }
        if(req.query.sortKey === 'views') {
            sort.views = -1;
        }
        const posts = await Post.find(find)
            .sort(sort)
            .limit(objectPagination.limitItems)
            .skip(objectPagination.skip)
            .populate('post_category_id', 'title slug')
            .populate('event_id')
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
        try {
            const slug = req.params.slug;
            const find = {
                slug: slug,
                deleted: false,
            };

            const post = await Post.findOne(find)
                .populate("post_category_id", "title")
                .populate("event_id", "title")
                .populate({
                    path: "voters",
                    select: "fullName",
                })
                .lean();

            if(post) {
                const user = await User.findOne({ _id: post.createdBy.account_id });
                if(user) {
                    post.accountFullName = user.isAdmin ? "Admin" : user.fullName;
                }
                const updatedBy = post.updatedBy.slice(-1)[0];
                if(updatedBy) {
                    const userUpdated = await User.findOne({ _id: updatedBy.account_id });
                    if(userUpdated) {
                        updatedBy.accountFullName = userUpdated.fullName;
                    }
                }
                res.json({
                    success: true,
                    data: {
                        post: post
                    }
                });
            } else {
                res.status(404).json({ success: false, message: "Post not found" });
            }
        } catch(error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    vote: async (req, res) => {
        try {
            const { id } = req.params;
            const user = res.locals.user;
            const post = await Post.findById(id);
            if(!post) {
                return res.status(404).json({ success: false, message: 'Post không tồn tại!' });
            }

            if(post.voters.includes(user._id)) {
                return res.status(400).json({ success: false, message: 'Bạn đã bình chọn rồi!' });
            }

            post.voters.push(user._id);
            post.votes = post.voters.length;
            await post.save();

            const userInfo = await User.findById(user._id).select('fullName');

            return res.status(200).json({
                success: true,
                data: {
                    votes: post.votes,
                    userFullName: `${userInfo.fullName}`,
                },
            });
        } catch(error) {
            console.error(error);
            return res.status(500).json({ message: 'Có lỗi xảy ra khi bình chọn.' });
        }
    },
    /* [POST] api/v1/posts/:id/cancel-vote */
    cancelVote: async (req, res) => {
        try {
            const { id } = req.params;
            const user = res.locals.user;
            const post = await Post.findById(id);
            if(!post) {
                return res.status(404).json({ success: false, message: 'Bài viết không tồn tại!' });
            }

            if(!post.voters.includes(user._id)) {
                return res.status(400).json({ success: false, message: 'Bạn chưa bình chọn!' });
            }

            post.voters.pull(user._id);
            post.votes = post.voters.length;
            await post.save();

            return res.status(200).json({
                success: true,
                data: {
                    votes: post.votes,
                },
            });
        } catch(error) {
            console.error(error);
            return res.status(500).json({ message: 'Có lỗi xảy ra khi hủy bình chọn.' });
        }
    },
    /* [GET] api/v1/posts/lastest */
    lastestPost: async (req, res) => {
        try {
            const find = { deleted: false };
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
            const latestPost = await Post.findOne(find)
                .sort({ createdAt: -1 })
                .populate('post_category_id', 'title slug')
                .populate('event_id')
                .lean();
            if(!latestPost) {
                return res.status(404).json({
                    success: false,
                    message: 'Không có bài viết nào đáp ứng điều kiện!',
                });
            }
            if(!latestPost.isFeatured) {
                return res.status(403).json({
                    success: false,
                    message: 'Bài viết mới nhất không được hiển thị trên trang chủ!',
                });
            }

            res.json({
                success: true,
                data: {
                    post: latestPost,
                },
            });
        } catch(error) {
            console.error("Lỗi khi lấy bài viết mới nhất:", error);
            res.status(500).json({ success: false, message: error.message });
        }
    },
    // [GET] api/v1/posts/home
    home: async (req, res) => {
        try {
            const find = { deleted: false, isFeatured: true };

            if(req.query.category) {
                const category = await PostCategory.findOne({ slug: req.query.category });
                if(category) {
                    find.post_category_id = category._id;
                } else {
                    return res.status(404).json({
                        success: false,
                        message: `Danh mục ${req.query.category} không tồn tại`,
                    });
                }
            }

            const posts = await Post.find(find)
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('post_category_id', 'title slug')
                .lean();

            res.json({
                success: true,
                data: {
                    posts: posts,
                },
            });
        } catch(error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },
}
export default controller;