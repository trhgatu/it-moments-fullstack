import md5 from 'md5';
import User from '../../models/user.model.js';
import ForgotPassword from '../../models/forgot-password.model.js';
import { generateRandomNumber } from '../../../../helpers/generate.js';
import { sendEmail } from '../../../../helpers/sendMail.js';
const controller = {
    /* [POST] api/v1/users/register */
    register: async (req, res) => {
        req.body.password = md5(req.body.password);
        const existEmail = await User.findOne({
            email: req.body.email,
            deleted: false,
        });
        if(existEmail) {
            res.json(
                {
                    code: 400,
                    message: 'Email đã tồn tại'
                }
            );
        } else {
            const user = new User({
                fullName: req.body.fullName,
                email: req.body.email,
                password: req.body.password
            });
            user.save();

            const token = user.token;

            res.cookie("token", token);

            console.log(req.body);
            res.json(
                {
                    code: 200,
                    message: " Tạo tài khoản thành công!",
                    token: token
                }
            );
        }

    },

    /* [POST] api/v1/users/login */
    login: async (req, res) => {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({
            email: email,
            deleted: false
        });

        if(!user) {
            res.json({
                code: 400,
                message: 'Email không tồn tại'
            });
            return;
        }
        if(md5(password) != user.password) {
            res.json({
                code: 400,
                message: "Sai mật khẩu !"
            });
            return;
        }
        const token = user.token;
        res.cookie("token", token);

        res.json({
            code: 200,
            message: 'Đăng nhập thành công',
            token: token
        })
    },

    forgotPassword: async (req, res) => {
        const email = req.body.email;

        console.log(email);

        const user = await User.findOne({
            email: email,
            deleted: false
        });
        if(!user) {
            res.json({
                code: 400,
                message: "Email không tồn tại"
            });
            return;
        }
        const otp = generateRandomNumber(6);

        const timeExpire = 5;

        //Lưu data vào database
        const objectForgotPassword = {
            email: email,
            otp: otp,
            expireAt: Date.now() + timeExpire * 60,
        }
        const forgotPassword = new ForgotPassword(objectForgotPassword);
        await forgotPassword.save();

        //Gửi otp qua email
        const subject = "Mã OTP xác minh lấy lại mật khẩu";
        const html = `
        Mã OTP để lấy lại mật khẩu của bạn là <b>${otp}</b> (Sử dụng trong ${timeExpire} phút)>
        Vui lòng không chia sẻ mã OTP này với bất kỳ ai>
        `
        await sendEmail(email, subject, html);

        res.json({
            code: 200,
            message: "Đã gửi mã OTP qua Email"
        })
    },
    otpPassword: async (req, res) => {
        const email = req.body.email;
        const otp = req.body.otp;

        const result = await ForgotPassword.find({
            email: email,
            otp: otp,
        });

        if(!result) {
            res.json({
                code: 400,
                message: "OTP ko hợp lệ"
            });
            return;
        }

        const user = await User.findOne({
            email: email
        });

        const token = user.token;
        res.cookie("token", token);

        console.log(email);
        console.log(otp);

        res.json({
            code: 200,
            message: "Xác thực thành công",
            token: token
        })
    },
    resetPassword: async (req, res) => {
        const token = req.cookies.token;
        const password = req.body.password;

        const user = await User.findOne({
            token: token
        })

        if(md5(password) === user.password) {
            res.json({ code: 400, message: "Vui lòng nhập mật khẩu mới khác mật khẩu cũ" });
        }
        await User.updateOne({ token }, { password: md5(password) });

        res.json({
            code: 200,
            message: "Đổi mật khẩu thành công"
        })
    },
    detail: async (req, res) => {
        const token = req.cookies.token;

        const user = await User.findOne({
            token: token,
            deleted: false
        }).select("-password -token");
        res.json({
            code: 200,
            message: "Thành công",
            info: user
        })
    }
};

export default controller;
