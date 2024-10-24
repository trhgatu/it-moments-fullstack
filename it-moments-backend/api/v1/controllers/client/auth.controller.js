import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../../models/user.model.js";

const controller = {
    /* [POST] /api/v1/auth/login */
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
            const accessToken = jwt.sign(
                {
                    id: user._id,
                    email: user.email,
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1h"
                }
            );
            const refreshToken = jwt.sign(
                {
                    id: user._id,
                    email: user.email
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "7d"
                }
            )
            user.refreshToken = refreshToken;
            await user.save();
            res.cookie("client_token", accessToken, { httpOnly: true, sameSite: "Lax", secure: true });
            res.cookie("refresh_token", refreshToken, { httpOnly: true, sameSite: "Lax", secure: true });
            return res.status(200).json({
                code: 200,
                message: 'Đăng nhập thành công',
            });
        } catch(error) {
            console.error(error);
            return res.status(500).json({
                code: 500,
                message: 'Có lỗi xảy ra trong quá trình đăng nhập',
            });
        }
    },
    register: async (req, res) => {
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
    },
    /* [POST] /api/v1/auth/refresh-token */
    refreshToken: async (req, res) => {
        const refreshToken = req.cookies.refresh_token;

        if(!refreshToken) {
            return res.status(401).json({ message: "Token không hợp lệ" });
        }

        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

            const user = await User.findById(decoded.id).select('-password');

            if(!user || user.refreshToken !== refreshToken) {
                return res.status(403).json({ message: "Refresh token không hợp lệ" });
            }

            const newAccessToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

            res.cookie("client_token", newAccessToken, { httpOnly: true, sameSite: "Lax", secure: true });
            return res.status(200).json({ accessToken: newAccessToken });
        } catch(error) {
            console.error("Lỗi xác thực refresh token:", error);
            return res.status(401).json({ message: "Refresh token không hợp lệ" });
        }
    },
};

export default controller;
