import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../../models/user.model.js";
import Role from '../../models/role.model.js';

const controller = {
    /* [POST] /api/v1/admin/auth/login */
    login: async (req, res) => {
        try {
            const email = req.body.email;
            const password = req.body.password;
            const user = await User.findOne(
                {
                    email: email,
                    deleted: false
                }
            )
                .select('-refreshToken')
                .populate('role_id', 'title permissions description isAdmin');

            if(!user) {
                return res.status(400).json({
                    code: 400,
                    message: 'Email không tồn tại',
                });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if(!isPasswordValid) {
                return res.status(400).json({
                    code: 400,
                    message: "Sai mật khẩu!",
                });
            }
            if(!user.isAdmin) {
                return res.status(403).json({
                    code: 403,
                    message: "Bạn không có quyền đăng nhập",
                });
            }
            user.password = undefined;
            const token = jwt.sign(
                {
                    id: user._id,
                    email: user.email,
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "7d"
                }
            );
            user.token = token;
            res.cookie("admin_token", token, {
                httpOnly: true,
                sameSite: "None",
                secure: false
            });
            return res.status(200).json({
                code: 200,
                message: 'Đăng nhập thành công',
                token: token,
                user: user
            });
        } catch(error) {
            console.error(error);
            return res.status(500).json({
                code: 500,
                message: 'Có lỗi xảy ra trong quá trình đăng nhập',
            });
        }
    },
    me: async (req, res) => {
        try {
            const user = res.locals.user;
            if(!user) {
                return res.status(404).json({ message: "Người dùng không tồn tại" });
            }
            const token = req.cookies.admin_token;
            return res.status(200).json({ user, token });
        } catch(error) {
            return res.status(500).json({ message: "Lỗi khi lấy thông tin người dùng" });
        }
    }
};

export default controller;
