import React, { useEffect } from "react";
import { Menu } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import { useUser } from "../../../../../context/UserContext";

function Sidenav({ color }) {
    const { pathname } = useLocation();
    const { user, role: userRole } = useUser(); // Lấy cả user và role

    useEffect(() => {
        console.log("User role has changed:", userRole);
    }, [userRole]);

    const menuItems = [
        { key: "dashboard", label: "Dashboard", path: "dashboard" },
        { key: "posts", label: "Bài viết", path: "posts", permission: "posts_view" },
        { key: "post-categories", label: "Danh mục bài viết", path: "post-categories", permission: "posts-category_view" },
        { key: "users", label: "Người dùng", path: "users", permission: "accounts_view" },
        { key: "roles", label: "Nhóm quyền", path: "roles", permission: "roles_view" },
        { key: "roles-permissions", label: "Phân quyền", path: "roles/permissions", permission: "roles_view" },
        { key: "events", label: "Sự kiện", path: "events", permission: "events_view" },
    ];

    return (
        <div className="sidenav">
            <div className="brand text-4xl">
                <span>IT Moments</span>
            </div>
            {user && <div className="user-greeting">Xin chào, {user.fullName}</div>}
            <hr />
            <Menu theme="light" mode="inline">
                {menuItems.map(({ key, label, path, permission }) => {
                    const hasPermission = permission ? userRole?.permissions.includes(permission) : true;

                    const isActive = pathname === `/${path}` || pathname.startsWith(`/${path}/`);

                    return hasPermission ? (
                        <Menu.Item key={key} className={isActive ? "ant-menu-item-selected" : ""}>
                            <NavLink to={path}>
                                <span className="icon" style={{ background: isActive ? color : "" }}>
                                    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 4C3 3.44772 3.44772 3 4 3H16C16.5523 3 17 3.44772 17 4V6C17 6.55228 16.5523 7 16 7H4C3.44772 7 3 6.55228 3 6V4Z" fill={color}></path>
                                        <path d="M3 10C3 9.44771 3.44772 9 4 9H10C10.5523 9 11 9.44771 11 10V16C11 16.5523 10.5523 17 10 17H4C3.44772 17 3 16.5523 3 16V10Z" fill={color}></path>
                                        <path d="M14 9C13.4477 9 13 9.44771 13 10V16C13 16.5523 13.4477 17 14 17H16C16.5523 17 17 16.5523 17 16V10C17 9.44771 16.5523 9 16 9H14Z" fill={color}></path>
                                    </svg>
                                </span>
                                <span className="label">{label}</span>
                            </NavLink>
                        </Menu.Item>
                    ) : null;
                })}
            </Menu>
        </div>
    );
}

export default Sidenav;
