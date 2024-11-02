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
        if(req.query.isLatest === 'true') {
            objectPagination.limitItems = 5;
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
            .populate({
                path: "voters",
                select: "fullName", // Chỉ lấy trường fullName
            });
        res.json(post);
    },
    vote: async (req, res) => {
        try {
            const { id } = req.params; // ID của post
            const user = res.locals.user; // Lấy user từ middleware

            // Kiểm tra xem người dùng đã bình chọn hay chưa
            const post = await Post.findById(id);
            if(!post) {
                return res.status(404).json({ success: false, message: 'Post không tồn tại!' });
            }

            if(post.voters.includes(user._id)) {
                return res.status(400).json({ success: false, message: 'Bạn đã bình chọn rồi!' });
            }

            // Cập nhật post với người dùng đã bình chọn
            post.voters.push(user._id); // Thêm ID người dùng vào danh sách voters
            post.votes = post.voters.length; // Cập nhật tổng số lượt bình chọn
            await post.save(); // Lưu lại thay đổi

            // Lấy thông tin người dùng
            const userInfo = await User.findById(user._id).select('fullName'); // Lấy firstName và lastName

            return res.status(200).json({
                success: true,
                data: {
                    votes: post.votes,
                    userFullName: `${userInfo.fullName}`, // Tạo tên đầy đủ
                },
            });
        } catch(error) {
            console.error(error);
            return res.status(500).json({ message: 'Có lỗi xảy ra khi bình chọn.' });
        }
    },

}
export default controller;