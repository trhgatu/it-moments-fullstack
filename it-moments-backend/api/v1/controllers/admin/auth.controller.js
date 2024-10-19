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
            );

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
            const role = await Role.findById(user.role_id);
            const token = jwt.sign(
                {
                    id: user._id,
                    email: user.email,
                    role: role.title
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1h"
                }
            );
            user.token = token;
            await user.save();
            res.cookie("admin_token", token, {
                httpOnly: true,
                sameSite: "Lax",
                secure: true
            });

            res.locals.role = role;
            return res.status(200).json({
                code: 200,
                message: 'Đăng nhập thành công',
                token: token,
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
    verifyToken: async (req, res) => {
        const token = req.cookies.admin_token;

        if(!token) {
            return res.status(401).json({ message: "Token không hợp lệ" });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.id)
                .select('-password -token')

            if(!user) {
                return res.status(404).json({ message: "Người dùng không tồn tại" });
            }
            const role = await Role.findById(user.role_id)
            .select("title permissions");
            return res.status(200).json({
                message: "Token hợp lệ",
                user: user,
                role: role
            });
        } catch(error) {
            console.error("Lỗi xác thực token:", error);
            return res.status(401).json({ message: "Token không hợp lệ" });
        }
    },
};

export default controller;
