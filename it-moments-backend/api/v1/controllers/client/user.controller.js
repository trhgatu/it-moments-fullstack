import bcrypt from 'bcrypt';
import User from '../../models/user.model.js';
import ForgotPassword from '../../models/forgot-password.model.js';
import { generateRandomNumber, generateRandomString } from '../../../../helpers/generate.js';
import { sendEmail } from '../../../../helpers/sendMail.js';

const controller = {
    /* [POST] api/v1/client/users/register */
    register: async (req, res) => {
        try {
            // Mã hóa mật khẩu bằng bcrypt
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            // Kiểm tra xem email đã tồn tại hay chưa
            const existEmail = await User.findOne({
                email: req.body.email,
                deleted: false,
            });

            if (existEmail) {
                return res.status(400).json({
                    code: 400,
                    message: 'Email đã tồn tại'
                });
            }

            // Tạo người dùng mới
            const user = new User({
                fullName: req.body.fullName,
                email: req.body.email,
                password: hashedPassword, // Sử dụng mật khẩu đã mã hóa
                token: generateRandomString(30) // Tạo token ngẫu nhiên
            });

            await user.save(); // Lưu người dùng vào cơ sở dữ liệu

            const token = user.token;

            // Thiết lập cookie cho token
            res.cookie("token", token, {
                httpOnly: true,
                sameSite: "Lax",
                secure: process.env.NODE_ENV === "production", // Bảo mật cookie trong môi trường production
            });

            return res.status(200).json({
                code: 200,
                message: "Tạo tài khoản thành công!",
                token: token
            });
        } catch (error) {
            console.error("Đã xảy ra lỗi trong quá trình đăng ký:", error);
            return res.status(500).json({
                code: 500,
                message: 'Có lỗi xảy ra trong quá trình tạo tài khoản',
            });
        }
    },

    /* [POST] api/v1/users/login */
    login: async (req, res) => {
        try {
            const email = req.body.email;
            const password = req.body.password;
            const user = await User.findOne({
                email: email,
                deleted: false
            });

            if (!user) {
                return res.status(400).json({
                    code: 400,
                    message: 'Email không tồn tại'
                });
            }

            // So sánh mật khẩu
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({
                    code: 400,
                    message: "Sai mật khẩu!"
                });
            }

            const token = user.token;
            res.cookie("token", token, {
                httpOnly: true,
                sameSite: "Lax",
                secure: process.env.NODE_ENV === "production",
            });

            return res.status(200).json({
                code: 200,
                message: 'Đăng nhập thành công',
                token: token
            });
        } catch (error) {
            console.error("Đã xảy ra lỗi trong quá trình đăng nhập:", error);
            return res.status(500).json({
                code: 500,
                message: 'Có lỗi xảy ra trong quá trình đăng nhập',
            });
        }
    },

    /* [POST] api/v1/users/forgot-password */
    forgotPassword: async (req, res) => {
        try {
            const email = req.body.email;

            const user = await User.findOne({
                email: email,
                deleted: false
            });
            if (!user) {
                return res.status(400).json({
                    code: 400,
                    message: "Email không tồn tại"
                });
            }

            const otp = generateRandomNumber(6);
            const timeExpire = 5; // Thời gian hết hạn OTP

            // Lưu data vào database
            const objectForgotPassword = {
                email: email,
                otp: otp,
                expireAt: Date.now() + timeExpire * 60 * 1000,
            }
            const forgotPassword = new ForgotPassword(objectForgotPassword);
            await forgotPassword.save();

            // Gửi OTP qua email
            const subject = "Mã OTP xác minh lấy lại mật khẩu";
            const html = `
                Mã OTP để lấy lại mật khẩu của bạn là <b>${otp}</b> (Sử dụng trong ${timeExpire} phút).
                Vui lòng không chia sẻ mã OTP này với bất kỳ ai.
            `;
            await sendEmail(email, subject, html);

            return res.status(200).json({
                code: 200,
                message: "Đã gửi mã OTP qua Email"
            });
        } catch (error) {
            console.error("Đã xảy ra lỗi trong quá trình gửi OTP:", error);
            return res.status(500).json({
                code: 500,
                message: 'Có lỗi xảy ra trong quá trình gửi mã OTP',
            });
        }
    },

    /* [POST] api/v1/users/otp-password */
    otpPassword: async (req, res) => {
        try {
            const email = req.body.email;
            const otp = req.body.otp;

            const result = await ForgotPassword.findOne({
                email: email,
                otp: otp,
                expireAt: { $gt: Date.now() } // Kiểm tra thời gian hết hạn
            });

            if (!result) {
                return res.status(400).json({
                    code: 400,
                    message: "OTP không hợp lệ hoặc đã hết hạn"
                });
            }

            const user = await User.findOne({
                email: email
            });

            const token = user.token;
            res.cookie("token", token, {
                httpOnly: true,
                sameSite: "Lax",
                secure: process.env.NODE_ENV === "production",
            });

            return res.status(200).json({
                code: 200,
                message: "Xác thực thành công",
                token: token
            });
        } catch (error) {
            console.error("Đã xảy ra lỗi trong quá trình xác thực OTP:", error);
            return res.status(500).json({
                code: 500,
                message: 'Có lỗi xảy ra trong quá trình xác thực OTP',
            });
        }
    },

    /* [POST] api/v1/users/reset-password */
    resetPassword: async (req, res) => {
        try {
            const token = req.cookies.token;
            const password = req.body.password;

            const user = await User.findOne({ token: token });

            if (!user) {
                return res.status(400).json({
                    code: 400,
                    message: "Người dùng không tồn tại"
                });
            }

            // So sánh mật khẩu mới với mật khẩu cũ
            const isSamePassword = await bcrypt.compare(password, user.password);
            if (isSamePassword) {
                return res.status(400).json({
                    code: 400,
                    message: "Vui lòng nhập mật khẩu mới khác mật khẩu cũ"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            await User.updateOne({ token }, { password: hashedPassword });

            return res.status(200).json({
                code: 200,
                message: "Đổi mật khẩu thành công"
            });
        } catch (error) {
            console.error("Đã xảy ra lỗi trong quá trình đặt lại mật khẩu:", error);
            return res.status(500).json({
                code: 500,
                message: 'Có lỗi xảy ra trong quá trình đặt lại mật khẩu',
            });
        }
    },

    /* [GET] api/v1/users/detail */
    detail: async (req, res) => {
        try {
            res.json({
                code: 200,
                message: "Thành công",
                info: req.user
            });
        } catch (error) {
            console.error("Đã xảy ra lỗi trong quá trình lấy thông tin người dùng:", error);
            return res.status(500).json({
                code: 500,
                message: 'Có lỗi xảy ra trong quá trình lấy thông tin người dùng',
            });
        }
    }
};

export default controller;
