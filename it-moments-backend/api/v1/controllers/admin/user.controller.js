import User from '../../models/user.model.js';
import Role from '../../models/role.model.js';
import filterStatus from '../../../../helpers/filterStatus.js';
import search from '../../../../helpers/search.js';
import pagination from '../../../../helpers/pagination.js';
import { sendEmail } from '../../../../helpers/sendMail.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
const saltRounds = 10;
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
    /* [POST] api/v1/admin/users/create */
    createPost: async (req, res) => {
        try {
            const { fullName, email, password, role_id, status, isAdmin, isVerified, avatar } = req.body;

            // Kiểm tra xem email có bị trùng không
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email đã tồn tại!',
                });
            }

            // Mã hóa mật khẩu
            const hashedPassword = await bcrypt.hash(password, 10);

            // Tạo người dùng mới
            const newUser = new User({
                fullName,
                email,
                password: hashedPassword,
                role_id: role_id, // Đảm bảo rằng role_id được gán đúng
                status: status || 'active',
                isAdmin: isAdmin || false,
                isVerified: isVerified || false,
                avatar: avatar,
                deleted: false,
            });

            await newUser.save();

            // Nếu người dùng chưa xác thực email, gửi email xác thực
            if (!isVerified) {
                const verificationToken = crypto.randomBytes(32).toString('hex');
                const verificationLink = `${FRONT_END_DOMAIN}/verify?token=${verificationToken}`;
                await sendEmail(
                    email,
                    'Xác thực tài khoản',
                    `Xin chào ${fullName},\n\nVui lòng nhấp vào link sau để xác thực tài khoản của bạn:\n${verificationLink}`
                );
            }

            res.status(201).json({
                success: true,
                message: 'Người dùng đã được tạo thành công!',
                data: newUser,
            });
        } catch (error) {
            console.error('Lỗi khi tạo người dùng:', error);
            res.status(500).json({
                success: false,
                message: 'Có lỗi xảy ra khi tạo người dùng.',
            });
        }
    },
    /* [GET] api/v1/admin/users/:id */
    detail: async (req, res) => {
        try {
            const { id } = req.params;

            // Find the user by ID
            const user = await User.findOne({ _id: id, deleted: false })
                .select("-password -token")
                .lean();

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Người dùng không tồn tại hoặc đã bị xóa.",
                });
            }

            // Fetch the role details if a role_id is associated with the user
            const role = user.role_id
                ? await Role.findOne({ _id: user.role_id, deleted: false }).lean()
                : null;

            res.json({
                success: true,
                data: {
                    ...user,
                    role,
                },
            });
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết người dùng:", error);
            res.status(500).json({
                success: false,
                message: "Có lỗi xảy ra khi lấy chi tiết người dùng.",
            });
        }
    },
    /* [DELETE] api/v1/admin/users/:id */
    delete: async (req, res) => {
        try {
            const { id } = req.params;

            // Find the user by ID
            const user = await User.findOne({ _id: id, deleted: false });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Người dùng không tồn tại hoặc đã bị xóa.",
                });
            }

            // Mark the user as deleted instead of actually removing from the database
            user.deleted = true;
            await user.save();

            res.json({
                success: true,
                message: "Người dùng đã được xóa thành công.",
            });
        } catch (error) {
            console.error("Lỗi khi xóa người dùng:", error);
            res.status(500).json({
                success: false,
                message: "Có lỗi xảy ra khi xóa người dùng.",
            });
        }
    },

};

export default controller;
