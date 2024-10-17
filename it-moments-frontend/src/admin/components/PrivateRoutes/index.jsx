import { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";

export const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if(parts.length === 2) return parts.pop().split(';')[0];
    return null;
};


const checkLogin = async () => {
    /* const token = getCookie('token');
    if(!token) {
        return false;
    } */

    try {
        const response = await fetch('http://localhost:3000/api/v1/admin/auth/verify-token', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if(response.ok) {
            const data = await response.json();
            // Kiểm tra dữ liệu trả về nếu cần
            console.log('Token valid:', data);
            return true;
        }
    } catch(error) {
        console.error('Xác thực token thất bại:', error);
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
