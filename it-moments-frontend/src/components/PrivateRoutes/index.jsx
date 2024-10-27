import { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useClientUser } from "../../context/ClientUserContext";

export default function PrivateRoutes() {
    const { user, loading } = useClientUser();

    useEffect(() => {
        console.log("User client:", user);
    }, [user, loading]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return user ? <Outlet /> : <Navigate to="/auth/login" />;
}
