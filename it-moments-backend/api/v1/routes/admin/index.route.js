import postRoutes from "./post.route.js";
import authRoutes from "./auth.route.js";
import userRoutes from "./user.route.js";
import roleRoutes from "./role.route.js";
import categoryRoutes from "./post-category.route.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requirePermission } from "../../middlewares/permissions.middleware.js";
const adminRoutes = (app) => {
    const version = "/api/v1/admin";
    app.use(version + "/posts", requireAuth, requirePermission("posts_view"), postRoutes);
    app.use(version + "/post-categories", requireAuth, requirePermission("posts-category_view"), categoryRoutes);
    app.use(version + "/users", requireAuth, requirePermission("accounts_view"), userRoutes);
    app.use(version + "/roles", requireAuth, requirePermission("roles_view"), roleRoutes);
    app.use(version + "/auth", authRoutes);
};

export default adminRoutes;
