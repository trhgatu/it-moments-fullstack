import React, { createContext, useContext, useState, useEffect } from 'react';

// Tạo UserContext
const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Hàm lấy token từ cookie
    const getTokenFromCookie = () => {
        const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
        return match ? match[2] : null;
    };

    // useEffect để gọi API xác thực khi tải lại trang
    useEffect(() => {
        const token = getTokenFromCookie(); // Lấy token từ cookie
        if (token) {
            // Gọi API verify-token để xác thực token và lấy thông tin user
            const fetchUser = async () => {
                try {
                    const response = await fetch("http://localhost:3000/api/v1/admin/auth/verify-token", {
                        method: "POST",
                        credentials: "include", // Đảm bảo cookie được gửi cùng request
                    });
                    const data = await response.json();
                    if (response.ok) {
                        setUser(data.user); // Cập nhật user trong state nếu xác thực thành công
                    }
                } catch (error) {
                    console.error("Lỗi xác thực người dùng:", error);
                }
            };
            fetchUser();
        }
    }, []); // useEffect chỉ chạy một lần khi component được mount

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Hook để sử dụng UserContext
export const useUser = () => useContext(UserContext);
