import { createBrowserRouter, Outlet } from "react-router-dom";
import Home from "../pages/Home";
import ErrorPage from "../pages/Error";
import Login from "../pages/Authentication/Login";
import About from "../pages/About";
import Event from "../pages/Event";
import AuthProvider from "../context/AuthProvider";
import { DefaultLayout } from "../components/Layouts";
const AuthLayout = () => {
    return <AuthProvider><Outlet /></AuthProvider>;
};

export default createBrowserRouter([
    {
        element: <AuthLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                element: <Login />,
                path: '/login',
            },
            {
                element: <DefaultLayout />,
                children: [
                    {
                        element: <Home />,
                        path: '/'
                    },
                    {
                        element: <Event />,
                        path: '/event'
                    }
                ]
            }

        ],
    },
]);
