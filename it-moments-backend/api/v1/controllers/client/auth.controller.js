import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../../models/user.model.js";
import { sendEmail } from '../../../../helpers/sendMail.js';
import crypto from 'crypto';
const controller = {
    /* [POST] /api/v1/auth/login */
    /* [POST] /api/v1/auth/login - Đăng nhập người dùng */
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email, deleted: false })
                .select('-refreshToken')
                .populate('role_id', 'title permissions');

            if (!user) {
                return res.status(400).json({
                    code: 400,
                    message: 'Email không tồn tại',
                });
            }
            if(!user.isVerified){
                return res.status(400).json({
                    code: 400,
                    message: 'Tài khoản chưa được xác thực!',
                });
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({
                    code: 400,
                    message: "Sai mật khẩu!",
                });
            }

            const token = jwt.sign(
                {
                    id: user._id,
                    email: user.email,
                },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );
            res.cookie("client_token", token, {
                httpOnly: true,
                sameSite: "None",
                secure: true,
            });
            console.log('Setting cookie:', res.get('Set-Cookie'));
            user.password = undefined;
            return res.status(200).json({
                code: 200,
                message: 'Đăng nhập thành công',
                token,
                user,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                code: 500,
                message: 'Có lỗi xảy ra trong quá trình đăng nhập',
            });
        }
    },
    register: async (req, res) => {
        try {
            const { fullName, email, password } = req.body;
            const existingUser = await User.findOne({ email, deleted: false });

            if (existingUser) {
                return res.status(400).json({
                    code: 400,
                    message: 'Email đã tồn tại',
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const verificationToken = crypto.randomBytes(32).toString('hex');

            const newUser = new User({
                fullName,
                email,
                password: hashedPassword,
                isAdmin: false,
                isVerified: false,
                verificationToken,
            });

            await newUser.save();

            const verificationLink = `http://localhost:5173/verify?token=${verificationToken}`;

            await sendEmail(
                email,
                'Xác thực tài khoản',
                `Xin chào ${fullName},\n\nVui lòng nhấp vào link sau để xác thực tài khoản của bạn:\n${verificationLink}`
            );
            return res.status(200).json({
                code: 200,
                message: 'Tạo tài khoản thành công! Vui lòng kiểm tra email để xác thực tài khoản.',
            });
        } catch (error) {
            console.error("Lỗi:", error);
            return res.status(500).json({
                code: 500,
                message: 'Lỗi khi tạo tài khoản',
            });
        }
    },
    verifyEmail: async (req, res) => {
        try {
            const { token } = req.query;

            const user = await User.findOne({ verificationToken: token });
            if (!user) {
                return res.status(400).json({
                    code: 400,
                    message: 'Token không hợp lệ hoặc đã hết hạn',
                });
            }
            user.isVerified = true;
            user.verificationToken = undefined;
            await user.save();

            return res.status(200).json({
                code: 200,
                message: 'Tài khoản đã được xác thực thành công!',
            });
        } catch (error) {
            console.error("Lỗi:", error);
            return res.status(500).json({
                code: 500,
                message: 'Lỗi khi xác thực tài khoản',
            });
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
    me: async (req, res) => {
        try {
            const user = res.locals.user;
            if (!user) {
                return res.status(404).json({ message: "Người dùng không tồn tại" });
            }
            const token = req.cookies.client_token;
            return res.status(200).json({ user, token });
        } catch (error) {
            console.error("Lỗi khi lấy thông tin người dùng:", error);
            return res.status(500).json({ message: "Lỗi khi lấy thông tin người dùng" });
        }
    },
};

export default controller;
