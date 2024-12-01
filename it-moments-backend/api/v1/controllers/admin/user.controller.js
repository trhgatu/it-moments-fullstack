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
            const { fullName, email, password, role_id, status, isAdmin, isVerified, bio, avatar } = req.body;

            const existingUser = await User.findOne({ email });
            if(existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email đã tồn tại!',
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                fullName,
                email,
                password: hashedPassword,
                status: status || 'active',
                isAdmin: isAdmin || false,
                isVerified: isVerified || false,
                avatar: avatar,
                deleted: false,
                bio: bio
            });
            if (role_id) {
                newUser.role_id = role_id;
            }

            await newUser.save();
            if(!isVerified) {
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
        } catch(error) {
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

            if(!user) {
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
        } catch(error) {
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
            const user = await User.findOne({ _id: id, deleted: false });

            if(!user) {
                return res.status(404).json({
                    success: false,
                    message: "Người dùng không tồn tại hoặc đã bị xóa.",
                });
            }
            user.deleted = true;
            await user.save();

            res.json({
                success: true,
                message: "Người dùng đã được xóa thành công.",
            });
        } catch(error) {
            console.error("Lỗi khi xóa người dùng:", error);
            res.status(500).json({
                success: false,
                message: "Có lỗi xảy ra khi xóa người dùng.",
            });
        }
    },
    editUser: async (req, res) => {
        try {
            const { id } = req.params;
            const { fullName, email, password, role_id, status, isAdmin, isVerified, bio } = req.body;

            // Tìm người dùng theo id
            const user = await User.findOne({ _id: id, deleted: false });
            if(!user) {
                return res.status(404).json({
                    success: false,
                    message: "Người dùng không tồn tại hoặc đã bị xóa.",
                });
            }

            // Kiểm tra và cập nhật email nếu có thay đổi
            if(email && email !== user.email) {
                const existingUser = await User.findOne({ email });
                if(existingUser) {
                    return res.status(400).json({
                        success: false,
                        message: "Email đã tồn tại.",
                    });
                }
                user.email = email;
            }

            // Cập nhật các thông tin khác của người dùng
            if(fullName) user.fullName = fullName;
            if(status) user.status = status;
            if(isAdmin !== undefined) user.isAdmin = isAdmin;
            if(isVerified !== undefined) user.isVerified = isVerified;
            if(bio) user.bio = bio;

            // Cập nhật role_id (nếu có) hoặc gán null nếu không có
            if(role_id) {
                user.role_id = role_id;
            } else {
                user.role_id = null;
            }

            // Cập nhật mật khẩu nếu có
            if(password) {
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                user.password = hashedPassword;
            }

            // Xử lý ảnh đại diện
            if(req.file && req.file.path) {
                user.avatar = req.file.path; // Cập nhật avatar mới nếu có
            } else {
                // Giữ lại avatar cũ nếu không có ảnh mới
                user.avatar = user.avatar || ''; // Nếu không có avatar cũ, sẽ để giá trị trống
            }

            // Lưu lại thông tin người dùng đã cập nhật
            await user.save();

            // Trả về phản hồi thành công
            res.json({
                success: true,
                message: "Người dùng đã được cập nhật thành công.",
                data: user,
            });
        } catch(error) {
            console.error("Lỗi khi chỉnh sửa người dùng:", error);
            res.status(500).json({
                success: false,
                message: "Có lỗi xảy ra khi chỉnh sửa người dùng.",
            });
        }
    }




};

export default controller;
