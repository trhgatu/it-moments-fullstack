export const loginPost = (req, res, next) => {
    if (!req.body.email) {
        req.flash("error", `Vui lòng nhập Email!`);
        return res.redirect("back");
    }
    if (!req.body.password) {
        req.flash("error", `Vui lòng nhập mật khẩu!`);
        return res.redirect("back");
    }
    next();
};
