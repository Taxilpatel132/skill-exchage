import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useUser } from './UserContext';

const SocketContext = createContext();

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const { user, token } = useUser();

    useEffect(() => {
        if (user && token) {
            // Initialize socket connection
            const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
                auth: {
                    token: token
                },
                transports: ['websocket', 'polling']
            });

            // Connection event handlers
            newSocket.on('connect', () => {
                console.log('Socket connected:', newSocket.id);
                setIsConnected(true);
            });

            newSocket.on('disconnect', () => {
                console.log('Socket disconnected');
                setIsConnected(false);
            });

            newSocket.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
                setIsConnected(false);
            });

            setSocket(newSocket);

            // Cleanup on unmount
            return () => {
                newSocket.close();
            };
        } else {
            // Disconnect socket if user is not logged in
            if (socket) {
                socket.close();
                setSocket(null);
                setIsConnected(false);
            }
        }
    }, [user, token]);

    const joinCourse = (courseId) => {
        if (socket && isConnected) {
            socket.emit('join_course', courseId);
        }
    };

    const leaveCourse = (courseId) => {
        if (socket && isConnected) {
            socket.emit('leave_course', courseId);
        }
    };

    const value = {
        socket,
        isConnected,
        joinCourse,
        leaveCourse
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};
