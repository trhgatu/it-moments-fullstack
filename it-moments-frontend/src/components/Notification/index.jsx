import React, { useEffect, useState } from 'react';
import { Badge, Avatar } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import io from 'socket.io-client';
import axios from 'axios';
import { API_URL } from '../../config/config';

const NotificationComponent = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const token = localStorage.getItem('client_token');

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`${API_URL}/notifications`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                });
                if(response.data.success) {
                    console.log(response.data.data)
                    setNotifications(response.data.data);
                    setUnreadCount(response.data.data.filter((notif) => !notif.read).length);
                }
            } catch(error) {
                console.error("Lỗi khi lấy thông báo:", error);
            }
        };
        fetchNotifications();

        if(token) {
            const socket = io('http://localhost:3000');
            socket.emit('register', token);

            socket.on('notificationUpdate', (data) => {
                const { notification } = data;
                if(notification.userId === userId) {
                    setNotifications((prevNotifications) => [
                        ...prevNotifications,
                        notification,
                    ]);
                    if(!notification.read) {
                        setUnreadCount((prevCount) => prevCount + 1);
                    }
                }
            });

            return () => {
                socket.disconnect();
            };
        } else {
            console.error('Token không tồn tại');
        }
    }, [userId, token]);

    const markAllAsRead = async () => {
        try {
            await axios.post(`${API_URL}/notifications/mark-as-read`, {}, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            setUnreadCount(0);
            setNotifications((prevNotifications) =>
                prevNotifications.map((notif) => ({ ...notif, read: true })));
        } catch(error) {
            console.error("Lỗi khi đánh dấu thông báo:", error);
        }
    };

    const toggleVisibility = () => {
        setIsVisible((prev) => !prev);
    };

    return (
        <div className="relative">
            <div
                onClick={toggleVisibility}
                className="cursor-pointer relative flex items-center"
            >
                <Avatar size={40} style={{ backgroundColor: 'white', cursor: 'pointer' }}>
                    <BellOutlined style={{ fontSize: '24px', color: 'black' }} />
                </Avatar>
                <Badge
                    count={unreadCount}
                    overflowCount={99}
                    style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        backgroundColor: '#ff4d4f',
                        borderRadius: '50%',
                        fontSize: '12px',
                        zIndex: 1,
                    }}
                />
            </div>
            {isVisible && (
                <div className="absolute right-0 mt-2 w-[40rem] p-4 bg-white border border-gray-200 rounded-lg shadow z-50 transform transition-all duration-300 ease-in-out opacity-0 visible opacity-100">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-800">Thông báo</h2>
                        <button
                            onClick={markAllAsRead}
                            className="text-blue-500 hover:underline text-sm"
                        >
                            Đánh dấu đã đọc
                        </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto scrollbar-hide">
                        {notifications.length > 0 ? (
                            notifications.map((notif, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center p-3 mb-2 rounded-lg ${notif.read
                                        ? "bg-gray-100"
                                        : "bg-blue-50 border-l-4 border-blue-500"
                                        }`}
                                >
                                    <Avatar
                                        src={notif.avatar}
                                        size={40}
                                        className="mr-3"
                                    />
                                    <div className="flex-grow">
                                        <p className="text-sm text-gray-700">{notif.content}</p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(notif.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 text-center">
                                Không có thông báo mới
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationComponent;
