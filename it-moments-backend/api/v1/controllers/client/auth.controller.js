import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../../models/user.model.js";
import { sendEmail } from '../../../../helpers/sendMail.js';
import { FRONT_END_DOMAIN } from '../../../../config/system.js';
import crypto from 'crypto';
const controller = {
    /* [POST] /api/v1/auth/login */
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email, deleted: false })
                .populate('role_id', 'title permissions');

            if(!user) {
                return res.status(400).json({
                    code: 400,
                    message: 'Email không tồn tại',
                });
            }
            if(!user.isVerified) {
                return res.status(400).json({
                    code: 400,
                    message: 'Tài khoản chưa được xác thực!',
                });
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if(!isPasswordValid) {
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
            user.password = undefined;
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
    register: async (req, res) => {
        try {
            const { fullName, email, password } = req.body;
            const existingUser = await User.findOne({ email, deleted: false });

            if(existingUser) {
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

            const verificationLink = `${FRONT_END_DOMAIN}/verify?token=${verificationToken}`;

            await sendEmail(
                email,
                'Xác thực tài khoản',
                `Xin chào ${fullName},\n\nVui lòng nhấp vào link sau để xác thực tài khoản của bạn:\n${verificationLink}`
            );
            return res.status(200).json({
                code: 200,
                message: 'Tạo tài khoản thành công! Vui lòng kiểm tra email để xác thực tài khoản.',
            });
        } catch(error) {
            console.error("Lỗi:", error);
            return res.status(500).json({
                code: 500,
                message: 'Lỗi khi tạo tài khoản',
            });
        }
    },
    /* [POST] /api/v1/admin/auth/logout */
    logout: async (req, res) => {
        try {
            res.clearCookie("client_token", {
                httpOnly: true,
                sameSite: "None",
                secure: true
            });
            return res.status(200).json({
                code: 200,
                message: "Đăng xuất thành công",
            });
        } catch(error) {
            return res.status(500).json({
                code: 500,
                message: "Có lỗi xảy ra trong quá trình đăng xuất",
            });
        }
    },
    verifyEmail: async (req, res) => {
        try {
            const { token } = req.query;

            const user = await User.findOne({ verificationToken: token });
            if(!user) {
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
        } catch(error) {
            console.error("Lỗi:", error);
            return res.status(500).json({
                code: 500,
                message: 'Lỗi khi xác thực tài khoản',
            });
        }
    },
};

export default controller;
