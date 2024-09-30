import userRoutes from "./user.route.js";
import postRoutes from "./post.route.js";

const adminRoutes = (app) => {
    const version = "/api/v1/admin";

    app.use(version + "/users", userRoutes);
    app.use(version + "/posts", postRoutes);
};

export default adminRoutes;
