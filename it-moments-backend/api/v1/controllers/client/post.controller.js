import Post from '../../models/post.model.js';
import Event from '../../models/event.model.js';
import PostCategory from '../../models/post-category.model.js';
import pagination from '../../../../helpers/pagination.js';
import Notification from '../../models/notification.model.js';
import search from '../../../../helpers/search.js';
import filterStatus from '../../../../helpers/filterStatus.js';
import User from '../../models/user.model.js';
import { io } from '../../../../server.mjs';
import Role from '../../models/role.model.js';
import moment from 'moment';
import { usersSocket } from '../../../../server.mjs';

const controller = {

    /* [GET] api/v1/posts */
    index: async (req, res) => {
        const filterStatusList = filterStatus(req.query);
        const find = { deleted: false };

        if(req.query.status) {
            find.status = req.query.status;
        }

        const eventStatus = req.query.eventStatus ? { status: req.query.eventStatus } : {};

        const objectSearch = search(req.query);

        if(req.query.keyword) {
            find.title = objectSearch.regex;
        }
        const getAllSubcategories = async (parentId) => {
            // Lấy tất cả danh mục con của danh mục hiện tại
            const subcategories = await PostCategory.find({ parent_id: parentId, deleted: false });
            let allSubcategories = [...subcategories];

            // Đệ quy để lấy danh mục con của các danh mục con
            for(const subcategory of subcategories) {
                const subsubcategories = await getAllSubcategories(subcategory._id); // Gọi lại hàm để lấy danh mục con của subcategory
                allSubcategories = [...allSubcategories, ...subsubcategories];
            }

            return allSubcategories;
        }

        if(req.query.category) {
            // Tìm danh mục cha
            const category = await PostCategory.findOne({
                slug: req.query.category,
            });

            if(category) {
                // Lấy tất cả danh mục con (bao gồm cả các danh mục con của danh mục con)
                const allSubcategories = await getAllSubcategories(category._id);

                // Thêm danh mục cha vào mảng các danh mục con
                const allCategoryIds = [category._id, ...allSubcategories.map(sub => sub._id)];

                // Cập nhật tìm kiếm bài viết thuộc tất cả các danh mục con và cha
                find.post_category_id = { $in: allCategoryIds };
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
        const objectPagination = pagination(initPagination, req.query, countPosts);

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

        // Lấy danh sách bài viết theo điều kiện tìm kiếm
        let posts = await Post.find(find)
            .sort(sort)
            .limit(objectPagination.limitItems)
            .skip(objectPagination.skip)
            .populate('post_category_id', 'title slug')
            .populate({
                path: "event_id",
                match: eventStatus
            })
            .lean();

        // Lọc các bài viết có sự kiện
        posts = posts.filter((post) => post.event_id !== null);

        // Cập nhật thông tin người tạo bài viết và người cập nhật
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

        // Trả về kết quả
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
                .populate("event_id")
                .populate({
                    path: "voters",
                    select: "fullName",
                })
                .populate({
                    path: "comments.user_id",
                    select: "fullName avatar"
                })
                .populate({
                    path: "comments.replies.user_id",
                    select: "fullName avatar"
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
            const post = await Post.findById(id).populate('event_id');

            if(!post) {
                return res.status(404).json({ success: false, message: 'Post không tồn tại!' });
            }

            const event = post.event_id;
            const eventStatus = event.status;
            const votingEndTime = new Date(event.votingEndTime);

            if(eventStatus !== 'active' || event.votingStatus !== 'active') {
                return res.status(400).json({
                    success: false,
                    message: 'Sự kiện đã kết thúc hoặc không cho phép bình chọn nữa!'
                });
            }

            if(moment().isAfter(votingEndTime)) {
                return res.status(400).json({
                    success: false,
                    message: 'Thời gian bình chọn đã kết thúc!'
                });
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
            const post = await Post.findById(id).populate("event_id");

            if(!post) {
                return res.status(404).json({ success: false, message: 'Bài viết không tồn tại!' });
            }

            if(!post.event_id) {
                return res.status(400).json({ success: false, message: 'Không tìm thấy sự kiện liên quan!' });
            }

            const event = post.event_id;
            const eventStatus = event.status;

            if(eventStatus !== 'active' || event.votingStatus !== 'active') {
                return res.status(400).json({ success: false, message: 'Sự kiện đã kết thúc hoặc không cho phép hủy bình chọn!' });
            }

            if(!post.voters || !Array.isArray(post.voters) || !post.voters.includes(user._id)) {
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
    /* [POST] api/v1/posts/:id/like */
    likePost: async (req, res) => {
        try {
            const { id } = req.params;
            const user = res.locals.user;
            const post = await Post.findById(id);

            if(!post) {
                return res.status(404).json({ success: false, message: 'Post không tồn tại!' });
            }

            if(post.likes.includes(user._id)) {
                return res.status(400).json({ success: false, message: 'Bạn đã like bài viết này!' });
            }

            post.likes.push(user._id);
            await post.save();

            io.emit('likeUpdate', {
                postId: post._id,
                likes: post.likes.length,
            });

            res.status(200).json({
                success: true,
                data: {
                    likes: post.likes.length,
                },
            });
        } catch(error) {
            console.error(error);
            res.status(500).json({ message: 'Có lỗi xảy ra khi like bài viết.' });
        }
    },
    commentPost: async (req, res) => {
        try {
            const { id } = req.params;
            const user = res.locals.user;
            const { content, parentCommentId } = req.body;

            const post = await Post.findById(id);
            if(!post) {
                return res.status(404).json({ success: false, message: 'Post không tồn tại!' });
            }

            const comment = {
                user_id: user._id,
                content: content,
                createdAt: new Date(),
                parentCommentId: null
            };

            post.comments.push(comment);
            await post.save();
            const populatedPost = await Post.findById(id).populate('comments.user_id', 'fullName avatar');
            res.status(200).json({
                success: true,
                data: {
                    comment: populatedPost.comments[populatedPost.comments.length - 1],
                    commentsCount: post.comments.length
                },
            });
        } catch(error) {
            console.error(error);
            res.status(500).json({ message: 'Có lỗi xảy ra khi bình luận.' });
        }
    },
    getComments: async (req, res) => {
        try {
            const { id } = req.params;
            const post = await Post.findById(id)
                .populate('comments.user_id', 'fullName avatar')
                .populate({
                    path: "comments.replies.user_id",
                    select: "fullName avatar"
                })


            if(!post) {
                return res.status(404).json({ success: false, message: 'Post không tồn tại!' });
            }

            res.status(200).json({
                success: true,
                data: {
                    comments: post.comments,
                    commentsCount: post.comments.length,
                },
            });
        } catch(error) {
            console.error(error);
            res.status(500).json({ message: 'Có lỗi xảy ra khi lấy bình luận.' });
        }
    },
    deleteComment: async (req, res) => {
        try {
            const { id, commentId } = req.params;
            const user = res.locals.user;

            const post = await Post.findById(id);
            if(!post) {
                return res.status(404).json({ success: false, message: 'Post không tồn tại!' });
            }

            const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId);
            if(commentIndex === -1) {
                return res.status(404).json({ success: false, message: 'Bình luận không tồn tại!' });
            }

            const comment = post.comments[commentIndex];
            if(comment.user_id.toString() !== user._id.toString() && !user.isAdmin) {
                return res.status(403).json({ success: false, message: 'Bạn không có quyền xóa bình luận này!' });
            }

            post.comments.splice(commentIndex, 1);
            await post.save();

            res.status(200).json({
                success: true,
                message: 'Bình luận đã được xóa.',
                commentsCount: post.comments.length,
            });
        } catch(error) {
            console.error(error);
            res.status(500).json({ message: 'Có lỗi xảy ra khi xóa bình luận.' });
        }
    },
    replyToComment: async (req, res) => {
        try {
            const { id } = req.params;
            const user = res.locals.user;
            const { content, parentCommentId, toUserId } = req.body;
            const post = await Post.findById(id);
            if(!post) {
                return res.status(404).json({ success: false, message: 'Bài viết không tồn tại!' });
            }

            const parentComment = post.comments.find(comment => comment._id.toString() === String(parentCommentId));
            if(!parentComment) {
                return res.status(404).json({ success: false, message: 'Bình luận mẹ không tồn tại!' });
            }
            const reply = {
                user_id: user._id,
                avatar: user.avatar,
                content: content,
                createdAt: new Date(),
                updatedAt: new Date(),
                parentCommentId: parentCommentId
            };
            parentComment.replies.push(reply);
            await post.save();

            let notificationContent = '';
            let targetUserId = toUserId;

            if(parentComment.replies.length > 1) {
                const lastReply = parentComment.replies[parentComment.replies.length - 2];
                if(lastReply.user_id.toString() !== user._id.toString()) {
                    targetUserId = lastReply.user_id;
                    notificationContent = `${user.fullName} đã trả lời lại bình luận của bạn: "${content}"`;
                }
            } else if(parentComment.user_id.toString() !== user._id.toString()) {
                notificationContent = `${user.fullName} đã trả lời bình luận của bạn: "${content}"`;
            }

            if(notificationContent) {
                const postCategory = await PostCategory.findById(post.post_category_id);
                if(!postCategory) {
                    return res.status(404).json({ success: false, message: 'Danh mục bài viết không tồn tại!' });
                }
                const notification = await Notification.create({
                    user_id: targetUserId,
                    content: notificationContent,
                    read: false,
                    avatar: user.avatar,
                    postId: id,
                    commentId: parentCommentId,
                    postCategorySlug: postCategory.slug,
                    postSlug: post.slug,
                });

                await notification.save();
                const userSocketId = usersSocket[targetUserId.toString()];
                if (userSocketId) {
                    userSocketId.forEach(socketId => {
                        io.to(socketId).emit('notificationUpdate', {
                            userId: targetUserId,
                            notification: {
                                content: notificationContent,
                                createdAt: new Date(),
                                avatar: user.avatar,
                                commentId: parentCommentId,
                            },
                        });
                        console.log(`Thông báo đã được gửi cho userId: ${targetUserId}`);
                    });
                } else {
                    console.log(`Không tìm thấy socket cho userId: ${targetUserId}`);
                }

            }

            res.status(200).json({
                success: true,
                data: {
                    reply: reply,
                    commentsCount: post.comments.length
                },
            });

        } catch(error) {
            console.error(error);
            res.status(500).json({ message: 'Có lỗi xảy ra khi trả lời bình luận.' });
        }
    },
    incrementViews: async (req, res) => {
        try {
            const postId = req.params.id;

            const post = await Post.findByIdAndUpdate(
                postId,
                { $inc: { views: 1 } },
                { new: true }
            );

            if(!post) {
                return res.status(404).json({ message: 'Bài viết không tồn tại' });
            }

            res.status(200).json({ message: 'Tăng view thành công', post });
        } catch(error) {
            console.error('Error incrementing views:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

}
export default controller;