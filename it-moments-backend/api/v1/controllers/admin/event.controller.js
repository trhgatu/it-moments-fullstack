import Event from '../../models/event.model.js';
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
        const event = await Event.findOne({
            _id: id,
            deleted: false,
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Sự kiện không tìm thấy.',
            });
        }

        res.json({
            success: true,
            message: 'Lấy chi tiết sự kiện thành công.',
            data: event,
        });
    },

    /* [PATCH] api/v1/admin/events/change-status/:id */
    changeStatus: async (req, res) => {
        try {
            const id = req.params.id;
            const status = req.body.status;

            await Event.updateOne({ _id: id }, { status });

            res.json({
                code: 200,
                message: "Cập nhật trạng thái thành công"
            });
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái:', error);
            res.json({
                code: 404,
                message: "Cập nhật trạng thái thất bại"
            });
        }
    },

    /* Cập nhật nhiều sự kiện */
    changeMulti: async (req, res) => {
        try {
            const { ids, key, value } = req.body;
            switch (key) {
                case "status":
                    await Event.updateMany({ _id: { $in: ids } }, { status: value });
                    return res.status(200).json({
                        code: 200,
                        message: "Cập nhật trạng thái thành công"
                    });
                case "delete":
                    await Event.updateMany({ _id: { $in: ids } }, { deleted: true, deletedAt: new Date() });
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
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                code: 500,
                message: "Cập nhật trạng thái thất bại"
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
        } catch (error) {
            console.error('Lỗi khi cập nhật sự kiện:', error);
            res.json({
                code: 400,
                message: "Lỗi khi cập nhật sự kiện.",
            });
        }
    },

    /* Xóa sự kiện */
    delete: async (req, res) => {
        try {
            const id = req.params.id;
            await Event.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() });
            res.json({
                code: 200,
                message: "Xóa sự kiện thành công"
            });
        } catch (error) {
            console.error('Lỗi khi xóa sự kiện:', error);
            res.json({
                code: 400,
                message: "Lỗi khi xóa sự kiện."
            });
        }
    },
}

export default controller;
