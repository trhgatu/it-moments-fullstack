// src/admin/components/Layouts/AuthLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const AdminAuthLayout = ({ children }) => {
    return (
        <div className="auth-layout">
            {children}
            <Outlet/>
        </div>
    );
};

export default AdminAuthLayout;
