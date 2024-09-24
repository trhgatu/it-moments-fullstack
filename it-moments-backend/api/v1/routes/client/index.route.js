import userRoutes from "./user.route.js";
import postRoutes from "./post.route.js";

const clientRouter = (app) => {
    const version = "/api/v1";

    // Routes cho user
    app.use(version + "/users", userRoutes);
    app.use(version + "/posts", postRoutes);
};

export default clientRouter;
