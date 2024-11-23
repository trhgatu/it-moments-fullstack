import userRoutes from "./user.route.js";
import postRoutes from "./post.route.js";
import authRoutes from "./auth.route.js";
import categoryRoutes from './post-category.route.js';
import notificationRoutes from "./notification.route.js";
const clientRouter = (app) => {
    const version = "/api/v1";
    // Routes cho user
    app.use(version + "/users", userRoutes);
    app.use(version + "/posts", postRoutes);
    app.use(version + "/post-categories", categoryRoutes);
    app.use(version + "/auth", authRoutes);
    app.use(version + "/notifications", notificationRoutes);
};

export default clientRouter;
