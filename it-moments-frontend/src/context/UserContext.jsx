// UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);

    const getTokenFromCookie = () => {
        const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
        return match ? match[2] : null;
    };

    useEffect(() => {
        const token = getTokenFromCookie();
        if (token) {
            const fetchUser = async () => {
                try {
                    const response = await fetch("http://localhost:3000/api/v1/admin/auth/verify-token", {
                        method: "POST",
                        credentials: "include",
                    });
                    const data = await response.json();
                    if (response.ok) {
                        setUser(data.user);
                        setRole(data.role);
                    }
                } catch (error) {
                    console.error("Lỗi xác thực người dùng:", error);
                }
            };
            fetchUser();
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, role, setUser, setRole }}>
            {children}
        </UserContext.Provider>
    );
};

// Hook để sử dụng UserContext
export const useUser = () => useContext(UserContext);
