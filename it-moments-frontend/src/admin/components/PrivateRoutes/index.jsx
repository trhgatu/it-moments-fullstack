import { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";

export default function PrivateRoutes() {
    const { user, loading } = useUser();

    useEffect(() => {
        console.log("User state in PrivateRoutes:", user);
        console.log("Loading state in PrivateRoutes:", loading);
    }, [user, loading]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return user ? <Outlet /> : <Navigate to="/admin/auth/login" />;
}
