import jwt from 'jsonwebtoken';
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import { prefixAdmin } from '../../../config/system.js';

export const requireAuth = async (req, res, next) => {
    const token = req.cookies.admin_token;

    if (!token) {
        return res.redirect(`${prefixAdmin}/auth/login`);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password -token");
        if (!user) {
            return res.status(401).redirect(`${prefixAdmin}/auth/login`);
        }

        const role = await Role.findById(user.role_id).select("title permissions");
        res.locals.user = user;
        res.locals.role = role;
        return next();
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).redirect(`${prefixAdmin}/auth/login`);
    }
};
