import { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";

export const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';')[0];
    return null;
};


const checkLogin = async () => {
    const token = getCookie('token');
    if(!token) {
        console.log("No token found.");
        return false;
    }

    try {
        const response = await fetch('http://localhost:3000/api/v1/admin/auth/verify-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        console.log("Response status:", response.status);
        console.log("Response data:", data);

        // Kiểm tra nếu response status là 200
        if(response.ok) {
            return true;
        }
    } catch(error) {
        console.error('Token verification failed:', error);
    }

    return false;
};

export default function PrivateRoutes() {
    const [isLogin, setIsLogin] = useState(null);

    useEffect(() => {
        const verifyLogin = async () => {
            const loggedIn = await checkLogin();
            console.log('Logged In:', loggedIn); // Log trạng thái đăng nhập
            setIsLogin(loggedIn);
        };
        verifyLogin();
    }, []);

    if(isLogin === null) {
        return <div>Loading...</div>;
    }
    return (
        <>
            {isLogin ? <Outlet /> : <Navigate to="/admin/auth/login" />}
        </>
    );
}
