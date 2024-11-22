import "../admin/assets/styles/main.css";
import "../admin/assets/styles/responsive.css";
import { Navigate } from "react-router-dom";
import Dashboard from '../admin/pages/Dashboard';
import PostDetail from "../admin/pages/Posts/PostDetail";
import RoleDetail from "../admin/pages/Roles/RoleDetail";
import EditRole from "../admin/pages/Roles/EditRole";
import PostAll from "../admin/pages/Posts/components/PostAll";
import EventAll from "../admin/pages/Events/components/EventAll";
import Posts from '../admin/pages/Posts';
import CreatePost from '../admin/pages/Posts/CreatePost';
import SignUp from '../admin/pages/Auth/SignUp';
import SignIn from '../admin/pages/Auth/SignIn';
import { AdminDefaultLayout } from "../admin/components/Layouts";
import AdminAuthLayout from "../admin/components/Layouts/AdminAuthLayout";
import PrivateRoutes from "../admin/components/PrivateRoutes";
import CategoriesAll from "../admin/pages/Categories/CategoriesAll";
import CategoryDetail from "../admin/pages/Categories/CategoryDetail";
import CreateCategory from "../admin/pages/Categories/CreateCategory";
import CreateEvent from "../admin/pages/Events/CreateEvent";
import Categories from "../admin/pages/Categories";
import EditCategory from "../admin/pages/Categories/EditCategory";
import 'antd/dist/reset.css';
import Users from "../admin/pages/Users";
import UsersAll from "../admin/pages/Users/components/UsersAll";
import Roles from "../admin/pages/Roles";
import RolesAll from "../admin/pages/Roles/components/RolesAll";
import Event from "../admin/pages/Events";
/* import CreateEvent from "../admin/pages/Events/CreateEvent"; */
import CreateRole from "../admin/pages/Roles/CreateRole";
import PermissionForm from "../admin/pages/Roles/PermissionForm";
import Profile from "../admin/pages/Profile";
export const adminRoute = [
    {
        path: "/admin",
        element: <PrivateRoutes />,
        children: [
            {
                element: <AdminDefaultLayout />,
                children: [
                    {
                        index: true,
                        element: <Navigate to="/admin/dashboard" replace />
                    },
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
                        element: <Categories />,
                        children: [
                            {
                                index: true,
                                element: <CategoriesAll />
                            },
                            {
                                path: "detail/:id",
                                element: <CategoryDetail />
                            },
                            {
                                path: "create",
                                element: <CreateCategory />
                            },
                            {
                                path: "edit/:id",
                                element : <EditCategory/>
                            }
                        ]
                    },
                    {
                        path: "users",
                        element: <Users />,
                        children: [
                            {
                                index: true,
                                element: <UsersAll />
                            },
                            /* {
                                path: "detail/:id",
                                element : <UserDetail/>
                            },
                            {
                                path: "create",
                                element: <CreateUser/>
                            } */
                        ]
                    },
                    {
                        path: "roles",
                        element: <Roles />,
                        children: [
                            {
                                index: true,
                                element: <RolesAll />
                            },
                            {
                                path: "detail/:id",
                                element : <RoleDetail/>
                            },
                            {
                                path: "create",
                                element: <CreateRole />
                            },
                            {
                                path: "permissions",
                                element: <PermissionForm />
                            },
                            {
                                path: "edit/:id",
                                element: <EditRole/>
                            }

                        ]
                    },
                    {
                        path :"events",
                        element: <Event />,
                        children: [
                            {
                                index: true,
                                element: <EventAll />
                            },
                            {
                                path: "create",
                                element: <CreateEvent />
                            },
                        ]

                    },
                    {
                        path: "profile",
                        element: <Profile />
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
