
import userRoutes from "./user.route.js";

const setupRoutes = (app) => {
    const version = "/api/v1";
    app.use(version + "/users", userRoutes);
};

export default setupRoutes;
