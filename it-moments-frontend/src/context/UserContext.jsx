// UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/v1/admin/auth/verify-token", {
                    method: "POST",
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                    setRole(data.role);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Lỗi xác thực người dùng:", error);
                setUser(null);
            }
        };
        fetchUser();
    }, []);


    return (
        <UserContext.Provider value={{ user, role, setUser, setRole }}>
            {children}
        </UserContext.Provider>
    );
};

// Hook để sử dụng UserContext
export const useUser = () => useContext(UserContext);
