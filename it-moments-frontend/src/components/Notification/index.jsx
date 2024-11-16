import React, { useEffect, useState } from 'react';
import { Dropdown, Menu, Badge } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import io from 'socket.io-client';
import axios from 'axios';  // Import axios
import { API_URL } from '../../config/config';

const NotificationComponent = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const token = localStorage.getItem('client_token');

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`${API_URL}/notifications`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                });
                if (response.data.success) {
                    setNotifications(response.data.data);
                    setUnreadCount(response.data.data.filter((notif) => !notif.read).length);
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông báo:", error);
            }
        };

        // Gọi API để tải thông báo khi người dùng đăng nhập
        fetchNotifications();

        if (token) {
            const socket = io('http://localhost:3000');
            socket.emit('register', token);

            socket.on('notificationUpdate', (data) => {
                const { notification } = data;

                if (notification.userId === userId) {
                    console.log('Notification received:', notification);  // Kiểm tra thông báo
                    console.log('Current userId:', userId);

                    // Thêm thông báo mới vào danh sách thông báo
                    setNotifications((prevNotifications) => [
                        ...prevNotifications,
                        notification,
                    ]);
                    setUnreadCount((prevCount) => prevCount + 1);  // Tăng số lượng thông báo chưa đọc
                }
            });

            return () => {
                socket.disconnect();
            };
        } else {
            console.error('Token không tồn tại');
        }
    }, [userId, token]);

    const menu = (
        <Menu>
            {notifications.length > 0 ? (
                notifications.map((notif, index) => (
                    <Menu.Item key={index}>
                        <div>{notif.content}</div>
                    </Menu.Item>
                ))
            ) : (
                <Menu.Item>
                    <div>Không có thông báo mới</div>
                </Menu.Item>
            )}
        </Menu>
    );

    const handleMenuClick = async () => {
        try {
            await axios.post(`${API_URL}/notifications/mark-as-read`, {}, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });
            setUnreadCount(0);  // Đặt lại số lượng thông báo chưa đọc
        } catch (error) {
            console.error("Lỗi khi đánh dấu thông báo:", error);
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* Biểu tượng chuông với badge thông báo */}
            <Dropdown overlay={menu} placement="bottomRight" trigger={['click']} onVisibleChange={handleMenuClick}>
                <Badge count={unreadCount} dot>
                    <BellOutlined
                        style={{
                            fontSize: '24px',
                            color: '#1890ff',
                            cursor: 'pointer',
                            transition: 'color 0.3s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#40a9ff';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#1890ff';
                        }}
                        onMouseDown={(e) => {
                            e.currentTarget.style.color = '#096dd9';
                        }}
                        onMouseUp={(e) => {
                            e.currentTarget.style.color = '#40a9ff';
                        }}
                    />
                </Badge>
            </Dropdown>
        </div>
    );
};

export default NotificationComponent;
