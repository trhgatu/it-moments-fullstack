import postRoutes from "./post.route.js";
import authRoutes from "./auth.route.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
const adminRoutes = (app) => {
    const version = "/api/v1/admin";
    app.use(version + "/posts", requireAuth, postRoutes);
    app.use(version + "/auth", authRoutes);
};

export default adminRoutes;
