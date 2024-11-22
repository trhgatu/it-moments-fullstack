import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Spin, Alert, Button, Descriptions, Typography } from 'antd';
import axios from 'axios';
import { API_URL } from '../../../config/config';
import { useUser } from '../../../context/UserContext';
import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete, AiOutlinePlusCircle } from 'react-icons/ai'; // React Icons

const { Title } = Typography;

const permissionsMapping = {
    posts_view: { label: "Xem bài viết", icon: <AiOutlineEye /> },
    posts_create: { label: "Tạo bài viết", icon: <AiOutlinePlusCircle /> },
    posts_edit: { label: "Chỉnh sửa bài viết", icon: <AiOutlineEdit /> },
    posts_delete: { label: "Xóa bài viết", icon: <AiOutlineDelete /> },
    "posts-category_view": { label: "Xem danh mục bài viết", icon: <AiOutlineEye /> },
    "posts-category_create": { label: "Tạo danh mục bài viết", icon: <AiOutlinePlusCircle /> },
    "posts-category_edit": { label: "Chỉnh sửa danh mục bài viết", icon: <AiOutlineEdit /> },
    "posts-category_delete": { label: "Xóa danh mục bài viết", icon: <AiOutlineDelete /> },
    roles_view: { label: "Xem nhóm quyền", icon: <AiOutlineEye /> },
    roles_create: { label: "Tạo nhóm quyền", icon: <AiOutlinePlusCircle /> },
    roles_edit: { label: "Chỉnh sửa nhóm quyền", icon: <AiOutlineEdit /> },
    roles_delete: { label: "Xóa nhóm quyền", icon: <AiOutlineDelete /> },
    accounts_view: { label: "Xem tài khoản", icon: <AiOutlineEye /> },
    accounts_create: { label: "Tạo tài khoản", icon: <AiOutlinePlusCircle /> },
    accounts_edit: { label: "Chỉnh sửa tài khoản", icon: <AiOutlineEdit /> },
    accounts_delete: { label: "Xóa tài khoản", icon: <AiOutlineDelete /> },
    events_view: { label: "Xem sự kiện", icon: <AiOutlineEye /> },
    events_create: { label: "Tạo sự kiện", icon: <AiOutlinePlusCircle /> },
    events_edit: { label: "Chỉnh sửa sự kiện", icon: <AiOutlineEdit /> },
    events_delete: { label: "Xóa sự kiện", icon: <AiOutlineDelete /> },
};

const RoleDetail = () => {
    const { id } = useParams();
    const { user } = useUser();
    const token = user?.token;
    const navigate = useNavigate();

    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRoleDetail = async () => {
            setLoading(true);
            setError(null);

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            };

            try {
                const response = await axios.get(`${API_URL}/admin/roles/detail/${id}`, config);
                setRole(response.data?.data);
            } catch (error) {
                console.error('Error fetching role detail:', error);
                setError('Không thể tải thông tin nhóm quyền.');
            } finally {
                setLoading(false);
            }
        };

        if (id && token) {
            fetchRoleDetail();
        }
    }, [id, token]);

    if (loading) {
        return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
    }

    if (error) {
        return <Alert message={error} type="error" showIcon />;
    }

    return (
        <div style={{ padding: '20px' }}>
            <Card
                title={<Title level={4}>Chi tiết nhóm quyền</Title>}
                extra={<Button onClick={() => navigate(-1)}>Quay lại</Button>}
            >
                <Descriptions
                    bordered
                    column={1}
                    title="Thông tin chi tiết"
                    size="middle"
                    labelStyle={{ fontWeight: 'bold', width: '30%' }}
                    contentStyle={{ width: '70%' }}
                >
                    <Descriptions.Item label="Tên nhóm quyền">{role?.title || 'Không có thông tin'}</Descriptions.Item>
                    <Descriptions.Item label="Mô tả">{role?.description || 'Không có thông tin'}</Descriptions.Item>
                    <Descriptions.Item label="Số lượng quyền">{role?.permissions?.length || 0} quyền</Descriptions.Item>
                    <Descriptions.Item label="Danh sách quyền">
                        {role?.permissions?.length ? (
                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                {role.permissions.map((permission, index) => {
                                    const permissionData = permissionsMapping[permission];
                                    return (
                                        <li key={index} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                                            {permissionData?.icon}
                                            <span style={{ marginLeft: '10px' }}>{permissionData?.label}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            'Không có quyền'
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">
                        {role?.createdAt
                            ? new Date(role.createdAt).toLocaleDateString('vi-VN', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                              })
                            : 'Không có thông tin'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày cập nhật">
                        {role?.updatedAt
                            ? new Date(role.updatedAt).toLocaleDateString('vi-VN', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                              })
                            : 'Không có thông tin'}
                    </Descriptions.Item>
                </Descriptions>
            </Card>
        </div>
    );
};

export default RoleDetail;
