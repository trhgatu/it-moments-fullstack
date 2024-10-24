import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const response = await axios.get("http://localhost:3000/api/v1/admin/auth/me", {
                    withCredentials: true,
                });

                if(response.status === 200) {
                    const { user: fetchedUser, token } = response.data;
                    setUser({ ...fetchedUser, token });
                    setRole(fetchedUser.role_id);

                } else {
                    setUser(null);
                    setRole(null);
                }
            } catch(error) {
                console.error("Lỗi xác thực người dùng:", error);
                setUser(null);
            } finally {
                setLoading(false); // Kết thúc loading
            }
        };

        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, role, token, loading, setUser, setRole }}>
            {children}
        </UserContext.Provider>
    );
};

// Hook để sử dụng UserContext
export const useUser = () => useContext(UserContext);
