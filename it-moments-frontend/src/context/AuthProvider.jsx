import React, { createContext, useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { useNavigate, useLocation } from 'react-router-dom';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = auth.onIdTokenChanged((user) => {
            console.log('From AuthProvider', { user });
            if(user?.uid) {
                setUser(user);
                localStorage.setItem('accessToken', user.accessToken);
            } else {
                setUser({});
                localStorage.clear();
                if(!['/login', '/', '/about', '/event'].includes(location.pathname)) {
                    navigate('/login');
                }
            }
        });

        return () => {
            unsubscribe();
        };
    }, [auth, navigate, location]);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}
