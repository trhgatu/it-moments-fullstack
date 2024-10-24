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
            .populate('role_id', 'title permissions isAdmin');

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
            user.password = undefined;
            const token = jwt.sign(
                {
                    id: user._id,
                    email: user.email,
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1h"
                }
            );
            user.token = token;
            res.cookie("admin_token", token, {
                httpOnly: true,
                sameSite: "Lax",
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
    /* register: async (req, res) => {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const existEmail = await User.findOne({ email: req.body.email, deleted: false });

            if(existEmail) {
                return res.status(400).json({ code: 400, message: 'Email đã tồn tại' });
            }

            const user = new User({
                fullName: req.body.fullName,
                email: req.body.email,
                password: hashedPassword,
            });


            await user.save();
            return res.status(200).json({ code: 200, message: "Tạo tài khoản thành công!" });
        } catch(error) {
            console.error("Lỗi:", error);
            return res.status(500).json({ code: 500, message: 'Lỗi khi tạo tài khoản' });
        }
    }, */
    me : async (req, res) => {
        try {
            const user = res.locals.user;
            if (!user) {
                return res.status(404).json({ message: "Người dùng không tồn tại" });
            }
            const token = req.cookies.admin_token;
            return res.status(200).json({ user , token});
        } catch (error) {
            return res.status(500).json({ message: "Lỗi khi lấy thông tin người dùng" });
        }
    }
};

export default controller;
