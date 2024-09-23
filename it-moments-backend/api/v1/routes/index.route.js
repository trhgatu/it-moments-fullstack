
import userRoutes from "./user.route.js";
import postRoutes from "./post.route.js";

const setupRoutes = (app) => {
    const version = "/api/v1";
    app.use(version + "/users", userRoutes);
    app.use(version + "/posts", postRoutes);
};

export default setupRoutes;
