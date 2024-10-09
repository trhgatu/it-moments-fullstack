import "../admin/assets/styles/main.css";
import "../admin/assets/styles/responsive.css";
import Dashboard from '../admin/pages/Dashboard';
import PostDetail from "../admin/pages/Posts/PostDetail.jsx";
import PostAll from "../admin/pages/Posts/PostAll";
import Posts from '../admin/pages/Posts';
import CreatePost from '../admin/pages/Posts/CreatePost';
import Profile from '../admin/pages/Profile';
import SignUp from '../admin/pages/Auth/SignUp';
import SignIn from '../admin/pages/Auth/SignIn';
import { AdminDefaultLayout } from "../admin/components/Layouts";
import AdminAuthLayout from "../admin/components/Layouts/AdminAuthLayout";
import PrivateRoutes from "../admin/components/PrivateRoutes";
import CategoriesAll from "../admin/pages/Categories/CategoriesAll";
import CategoryDetail from "../admin/pages/Categories/CategoryDetail";
import CreateCategory from "../admin/pages/Categories/CreateCategory";
import Categories from "../admin/pages/Categories";
import 'antd/dist/reset.css';

export const adminRoute = [
    {
        path: "/admin",
        element: <PrivateRoutes />,
        children: [
            {
                element: <AdminDefaultLayout />,
                children: [
                    {
                        path: "dashboard",
                        element: <Dashboard />
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
                                path: "detail/:id",
                                element: <PostDetail />
                            },
                            {
                                path: "create",
                                element: <CreatePost />
                            }
                        ]
                    },
                    {
                        path: "post-categories",
                        element: <Categories/>,
                        children: [
                            {
                                index : true,
                                element : <CategoriesAll/>
                            },
                            {
                                path: "detail/:id",
                                element : <CategoryDetail/>
                            },
                            {
                                path: "create",
                                element: <CreateCategory/>
                            }
                        ]
                    }

                ]
            }
        ]
    },
    {
        path: "/admin/auth",
        element: <AdminAuthLayout />,
        children: [
            {
                path: "login",
                element: <SignIn />
            },

        ]
    },

    {
        path: "*",
        element: <h1>404 - Page Not Found</h1>
    }
];
