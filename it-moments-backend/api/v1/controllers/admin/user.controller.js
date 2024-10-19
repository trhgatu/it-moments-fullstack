import User from '../../models/user.model.js';
import Role from '../../models/role.model.js';
import filterStatus from '../../../../helpers/filterStatus.js';
import search from '../../../../helpers/search.js';
import pagination from '../../../../helpers/pagination.js';

const controller = {
    /* [GET] api/v1/admin/users */
    index: async (req, res) => {
        try {
            const filterStatusList = filterStatus(req.query);
            const find = { deleted: false };

            if(req.query.status) {
                find.status = req.query.status;
            }

            const objectSearch = search(req.query);
            if(req.query.keyword) {
                find.title = objectSearch.regex;
            }

            const initPagination = {
                currentPage: 1,
                limitItems: 6,
            };

            const countUsers = await User.countDocuments(find);
            const objectPagination = pagination(initPagination, req.query, countUsers);

            const sort = {};
            if(req.query.sortKey && req.query.sortValue) {
                sort[req.query.sortKey] = req.query.sortValue;
            } else {
                sort.position = "desc";
                sort.createdAt = "desc";
            }

            const users = await User.find(find)
                .select("-password -token")
                .sort(sort)
                .limit(objectPagination.limitItems)
                .skip(objectPagination.skip)
                .lean();

            const userRoles = await Promise.all(users.map(async (user) => {
                const role = await Role.findOne({ _id: user.role_id, deleted: false });
                return { ...user, role };
            }));

            res.json({
                success: true,
                data: {
                    users: userRoles,
                    filterStatus: filterStatusList,
                    keyword: objectSearch.keyword,
                    pagination: objectPagination,
                },
            });
        } catch(error) {
            console.error("Lỗi khi lấy người dùng:", error);
            res.status(500).json({
                success: false,
                message: "Đã xảy ra lỗi khi lấy dữ liệu người dùng",
            });
        }
    },
};

export default controller;
