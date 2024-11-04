import About from "../pages/About";
import { DefaultLayout } from "../components/Layouts";
import Posts from "../pages/Posts";
import Home from "../pages/Home";
import Event from "../pages/Event";
import InfoUser from "../pages/InfoUser";
import PostDetail from "../pages/PostDetail/PostDetail";
import PostEventDetail from "../pages/PostEventDetail/PostEventDetail";
import Login from "../pages/Authentication/Login";
import Register from "../pages/Authentication/Register";
import Error from "../pages/Error";
import Profile from "../pages/Profile";
import PrivateRoutes from "../components/PrivateRoutes";
import VerifyEmail from "../pages/VerifyEmail";
import Academic from "../pages/Academic";
export const clientRoute = [
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            {
                path: "/",
                element: <Home />
            },

            {
                path: "posts/:category",
                element: <Posts />,
                children: [
                    {
                        path: ":slug",
                        element: <PostDetail />
                    },

                ]
            },
            {
                path: "posts/su-kien",
                element: <Event />,
                children: [
                    {
                        path: ":slug",
                        element: <PostEventDetail />
                    },

                ]
            },
            {
                path: "posts/hoc-thuat",
                element: <Academic />,
                children: [
                    {
                        path: ":slug",
                        element: <PostDetail />
                    },

                ]
            },
            {
                path: "about",
                element: <About />
            },
            {
                path: "profile",
                element: <Profile />
            },
            {
                path: "*",
                element: <Error />
            },
            {
                path: "/profile",
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
    {
        path: "verify",
        element: <VerifyEmail/>
    }
];
