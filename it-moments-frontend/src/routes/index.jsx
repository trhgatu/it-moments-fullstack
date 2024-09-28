import About from "../pages/About";
import { DefaultLayout } from "../components/Layouts";
import Academic from "../pages/Academic";
import PrivateRoutes from "../components/PrivateRoutes";
import Posts from "../pages/Posts";
import Home from "../pages/Home";
import Event from "../pages/Event";
import PostsNew from "../pages/Posts/PostsNew";
import PostAll from "../pages/Posts/PostAll";
import InfoUser from "../pages/InfoUser";
import PostDetail from "../pages/Posts/PostDetail";
import Login from "../pages/Authentication/Login";
import Register from "../pages/Authentication/Register"; // Nhớ import Register
import Error from "../pages/Error"; // Nhớ import Error nếu bạn có

export const routes = [
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "event",
                element: <Event />
            },
            {
                path: "posts",
                element: <Posts />,
                children: [
                    {
                        index: true,
                        element: <PostAll />
                    },
                    {
                        path: "news",
                        element: <PostsNew />
                    },
                    {
                        path: ":id",
                        element: <PostDetail />
                    },
                ]
            },
            {
                path: "about",
                element: <About />
            },
            {
                path: "academic",
                element: <Academic />
            },
            {
                path: "*",
                element: <Error /> // Page not found
            },
            {
                path: "*",
                element: <PrivateRoutes />,
                children: [
                    {
                        path: "info-user",
                        element: <InfoUser />
                    },
                ]
            },
        ]
    },
    {
        path: "login",
        element: <Login />
    },
    {
        path: "register",
        element: <Register />
    },
];
