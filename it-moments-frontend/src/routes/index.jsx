import { clientRoute } from "./clientRoute";
import { adminRoute } from "./adminRoute";

export const routes = [
    ...clientRoute,
    ...adminRoute
];
