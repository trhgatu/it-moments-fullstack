import Event from '../../models/event.model.js';
import Post from '../../models/post.model.js';
import pagination from '../../../../helpers/pagination.js';
import search from '../../../../helpers/search.js';
import filterStatus from '../../../../helpers/filterStatus.js';
import User from '../../models/user.model.js';

const controller = {
    /* [GET] api/v1/admin/events */
    index: async (req, res) => {
        const filterStatusList = filterStatus(req.query);
        const find = {
            deleted: false
        };

        // Tìm kiếm theo từ khóa
        const objectSearch = search(req.query);
        if(req.query.keyword) {
            find.title = objectSearch.regex;
        }

        // Phân trang
        const initPagination = {
            currentPage: 1,
            limitItems: 6,
        };
        const countEvents = await Event.countDocuments(find);
        const objectPagination = pagination(initPagination, req.query, countEvents);

        const sort = {};
        if(req.query.sortKey && req.query.sortValue) {
            sort[req.query.sortKey] = req.query.sortValue;
        } else {
            sort.createdAt = "desc";
        }

        const events = await Event.find(find)
            .sort(sort)
            .limit(objectPagination.limitItems)
            .skip(objectPagination.skip)
            .populate('createdBy', 'fullName')
            .lean();

        res.json({
            success: true,
            data: {
                events: events,
                filterStatus: filterStatusList,
                keyword: objectSearch.keyword,
                pagination: objectPagination,
            },
        });
    },

    /* [GET] api/v1/admin/events/detail/:id */
    detail: async (req, res) => {
        const id = req.params.id;
        try {
            // Tìm sự kiện dựa trên ID
            const event = await Event.findOne({
                _id: id,
                deleted: false,
            });

            if(!event) {
                return res.status(404).json({
                    success: false,
                    message: 'Sự kiện không tìm thấy.',
                });
            }

            const posts = await Post.find({ event_id: id, deleted: false }).populate("post_category_id");
            const totalVotes = posts.reduce((sum, post) => sum + (post.votes || 0), 0);
            res.json({
                success: true,
                message: 'Lấy chi tiết sự kiện thành công.',
                data: {
                    event,
                    totalVotes,
                    posts,
                },
            });
        } catch(error) {
            console.error('Lỗi khi lấy chi tiết sự kiện:', error);
            res.status(500).json({
                success: false,
                message: 'Đã xảy ra lỗi khi lấy chi tiết sự kiện.',
            });
        }
    },
    createEvent: async (req, res) => {
        if(req.body.position == '' || isNaN(req.body.position)) {
            const countPosts = await Event.countDocuments();
            req.body.position = countPosts + 1;
        } else {
            req.body.position = parseInt(req.body.position);
        }

        req.body.createdBy = {
            account_id: res.locals.user.id,
        };

        try {
            const post = new Event(req.body);
            const data = await post.save();

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
    },

    editPatch: async (req, res) => {
        try {
            const id = req.params.id;
            await Event.updateOne({ _id: id }, req.body);

            res.json({
                code: 200,
                message: "Cập nhật sự kiện thành công",
            });
        } catch(error) {
            console.error('Lỗi khi cập nhật sự kiện:', error);
            res.json({
                code: 400,
                message: "Lỗi khi cập nhật sự kiện.",
            });
        }
    },
    delete: async (req, res) => {
        try {
            const id = req.params.id;
            await Event.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() });
            res.json({
                code: 200,
                message: "Xóa sự kiện thành công"
            });
        } catch(error) {
            console.error('Lỗi khi xóa sự kiện:', error);
            res.json({
                code: 400,
                message: "Lỗi khi xóa sự kiện."
            });
        }
    },
}

export default controller;
