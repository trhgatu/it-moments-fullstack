// ClientSocketContext.js
import { createContext, useContext, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

const ClientSocketContext = createContext(null);

export const ClientSocketProvider = ({ children }) => {
    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from socket server');
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
        };
    }, []);

    return (
        <ClientSocketContext.Provider value={socket}>
            {children}
        </ClientSocketContext.Provider>
    );
};

export const useClientSocket = () => useContext(ClientSocketContext);
