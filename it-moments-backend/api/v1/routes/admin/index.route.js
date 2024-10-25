import postRoutes from "./post.route.js";
import authRoutes from "./auth.route.js";
import userRoutes from "./user.route.js";
import roleRoutes from "./role.route.js";
import dashboardRoutes from "./dashboard.js";
import categoryRoutes from "./post-category.route.js";
import { requireAdminRole, requireAuth } from "../../middlewares/auth.middleware.js";
import { requirePermission } from "../../middlewares/permissions.middleware.js";
const adminRoutes = (app) => {
    const version = "/api/v1/admin";
    app.use(version + "/dashboard", requireAuth, requireAdminRole, dashboardRoutes);
    app.use(version + "/posts", requireAuth, requireAdminRole, requirePermission("posts_view"), postRoutes);
    app.use(version + "/post-categories", requireAuth, requireAdminRole, requirePermission("posts-category_view"), categoryRoutes);
    app.use(version + "/users", requireAuth, requireAdminRole, requirePermission("accounts_view"), userRoutes);
    app.use(version + "/roles", requireAuth, requireAdminRole, requirePermission("roles_view"), roleRoutes);
    app.use(version + "/auth", authRoutes);
};

export default adminRoutes;
