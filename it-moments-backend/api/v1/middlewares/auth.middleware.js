import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import { prefixAdmin } from '../../../config/system.js';

export const requireAuth = async (req, res, next) => {
    if(!req.cookies.token) {
        res.redirect(`${prefixAdmin}/auth/login`);
    } else {
        const user = await User.findOne({
            token: req.cookies.token
        }).select("-password");
        if(!user) {
            res.redirect(`${prefixAdmin}/auth/login`);
        } else {
            const role = await Role.findOne({
                _id: user.role_id
            }).select("title permissions");
            res.locals.user = user;
            res.locals.role = role;
            next();
        }
    }
};
