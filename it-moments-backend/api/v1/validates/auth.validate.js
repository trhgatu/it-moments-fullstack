import validator from 'validator';

export const loginPost = (req, res, next) => {
    if(!req.body.email) {
        req.flash("error", `Vui lòng nhập Email!`);
        return res.redirect("back");
    }
    if(!req.body.password) {
        req.flash("error", `Vui lòng nhập mật khẩu!`);
        return res.redirect("back");
    }
    next();
};

export const validateRegister = (req, res, next) => {
    const { email, password } = req.body;
    if(!email || !validator.isEmail(email)) {
        return res.status(400).json({
            message: 'Email không hợp lệ!',
        });
    }
    if(!password || password.length < 8) {
        return res.status(400).json({
            message: 'Mật khẩu phải có ít nhất 8 ký tự!',
        });
    }
    next();
}
export const validateForgotPassword = (req, res, next) => {
    const { email } = req.body;

    if (!email || !validator.isEmail(email)) {
        return res.status(400).json({
            message: 'Email không hợp lệ!',
        });
    }

    next();
};
export const validateResetPassword = (req, res, next) => {
    const { password, confirmPassword } = req.body;
    if (!password || password.length < 8) {
        return res.status(400).json({
            message: 'Mật khẩu phải có ít nhất 8 ký tự!',
        });
    }
    next();
};
