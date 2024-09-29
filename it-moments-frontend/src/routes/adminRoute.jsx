import "../admin/assets/styles/main.css";
import "../admin/assets/styles/responsive.css";
import Dashboard from '../admin/pages/Dashboard';
import Tables from '../admin/pages/Tables';
import Profile from '../admin/pages/Profile';
import SignUp from '../admin/pages/Auth/SignUp';
import SignIn from '../admin/pages/Auth/SignIn';
import { AdminDefaultLayout } from "../admin/components/Layouts";
import 'antd/dist/reset.css';
export const adminRoute = [
    {
        path: "/admin",
        element: <AdminDefaultLayout />,
        children: [
            {
                path: "dashboard",
                element: <Dashboard />
            },
            {
                path: "tables",
                element: <Tables />
            },
            {
                path: "profile",
                element: <Profile />
            },
        ]

    },
];
