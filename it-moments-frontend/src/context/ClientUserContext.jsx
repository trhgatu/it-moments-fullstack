import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import {API_URL} from '../config/config';
const ClientUserContext = createContext();

export const ClientUserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_URL}/auth/me`, {
                    withCredentials: true,
                });
                console.log(response.data);
                if(response.status === 200) {
                    const { user: fetchedUser, token } = response.data;
                    setUser({ ...fetchedUser, token });
                    setToken(token);
                } else {
                    setUser(null);
                }
            } catch(error) {
                console.error("Lỗi xác thực người dùng:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return (
        <ClientUserContext.Provider value={{ user, token, loading, setUser }}>
            {children}
        </ClientUserContext.Provider>
    );
};

// Hook để sử dụng ClientUserContext
export const useClientUser = () => useContext(ClientUserContext);
