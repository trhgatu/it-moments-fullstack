import jwt from 'jsonwebtoken';
import User from "../models/user.model.js";

export const requireAuth = async (req, res, next) => {
    const token = req.cookies.admin_token;

    if(!token) {
        return res.status(401).json({ message: "Token không hợp lệ hoặc hết hạn" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).populate('role_id', 'title permissions isAdmin').select("-password -token");

        if(!user) {
            return res.status(401).json({ message: "Người dùng không tồn tại" });
        }
        res.locals.user = user;
        res.locals.role = user.role_id;

        next();
    } catch(error) {
        console.error("Token verification error:", error);
        return res.status(401).json({ message: "Token không hợp lệ" });
    }
};
export const requireClientAuth = async (req, res, next) => {
    const token = req.cookies.client_token;

    if(!token) {
        return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password -token");

        if(!user) {
            return res.status(401).json({ message: "Người dùng không tồn tại" });
        }
        res.locals.user = user;

        next();
    } catch(error) {
        console.error("Token verification error:", error);
        return res.status(401).json({ message: "Token không hợp lệ" });
    }
};

export const requireAdminRole = (req, res, next) => {
    const user = res.locals.user;
    if(user.isAdmin === false) {
        return res.status(403).json({
            message: " Chỉ quản trị viên mới có thể truy cập"
        })
    }

    next();
};
