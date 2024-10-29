import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Checkbox, Form, message } from 'antd';
import axios from 'axios';
import { useUser } from '../../../context/UserContext';
import { API_URL } from '../../../config/config'
const PermissionForm = ({ role }) => {
    const { user } = useUser();
    const [records, setRecords] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        const token = user?.token;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            withCredentials: true,
        };

        const fetchRecords = async () => {
            try {
                const response = await axios.get(`${API_URL}/admin/roles/permissions`, config);
                setRecords(response.data.records);

                const initialValues = {};
                response.data.records.forEach((record) => {
                    const permissions = record.permissions;
                    initialValues[record._id] = {
                        'posts_view': permissions.includes('posts_view'),
                        'posts_create': permissions.includes('posts_create'),
                        'posts_edit': permissions.includes('posts_edit'),
                        'posts_delete': permissions.includes('posts_delete'),
                        'posts-category_view': permissions.includes('posts-category_view'),
                        'posts-category_create': permissions.includes('posts-category_create'),
                        'posts-category_edit': permissions.includes('posts-category_edit'),
                        'posts-category_delete': permissions.includes('posts-category_delete'),
                        'roles_view': permissions.includes('roles_view'),
                        'roles_create': permissions.includes('roles_create'),
                        'roles_edit': permissions.includes('roles_edit'),
                        'roles_delete': permissions.includes('roles_delete'),
                        'accounts_view': permissions.includes('accounts_view'),
                        'accounts_create': permissions.includes('accounts_create'),
                        'accounts_edit': permissions.includes('accounts_edit'),
                        'accounts_delete': permissions.includes('accounts_delete'),
                    };
                });

                form.setFieldsValue(initialValues); // Gán giá trị mặc định vào form
            } catch(error) {
                console.error('Lỗi khi lấy dữ liệu quyền:', error);
            }
        };

        fetchRecords();
    }, [form, user]);



    const handleSubmit = async () => {
        const values = form.getFieldsValue();
        const permissions = Object.entries(values).map(([key, value]) => ({
            id: key,
            permissions: [
                value['posts_view'] ? 'posts_view' : null,
                value['posts_create'] ? 'posts_create' : null,
                value['posts_edit'] ? 'posts_edit' : null,
                value['posts_delete'] ? 'posts_delete' : null,
                value['posts-category_view'] ? 'posts-category_view' : null,
                value['posts-category_create'] ? 'posts-category_create' : null,
                value['posts-category_edit'] ? 'posts-category_edit' : null,
                value['posts-category_delete'] ? 'posts-category_delete' : null,
                value['roles_view'] ? 'roles_view' : null,
                value['roles_create'] ? 'roles_create' : null,
                value['roles_edit'] ? 'roles_edit' : null,
                value['roles_delete'] ? 'roles_delete' : null,
                value['accounts_view'] ? 'accounts_view' : null,
                value['accounts_create'] ? 'accounts_create' : null,
                value['accounts_edit'] ? 'accounts_edit' : null,
                value['accounts_delete'] ? 'accounts_delete' : null,
            ].filter(Boolean),
        }));

        try {
            const token = user?.token;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                withCredentials: true,
            };
            await axios.patch('http://localhost:3000/api/v1/admin/roles/permissions', { permissions: JSON.stringify(permissions) }, config);
            message.success('Cập nhật quyền thành công!');
        } catch(error) {
            message.error('Có lỗi xảy ra khi cập nhật quyền.');
        }
    };

    const renderCheckboxes = (itemPrefix, roleId) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Form.Item name={[roleId, `${itemPrefix}_view`]} valuePropName="checked" noStyle>
                <Checkbox />
            </Form.Item>
            <Form.Item name={[roleId, `${itemPrefix}_create`]} valuePropName="checked" noStyle>
                <Checkbox />
            </Form.Item>
            <Form.Item name={[roleId, `${itemPrefix}_edit`]} valuePropName="checked" noStyle>
                <Checkbox />
            </Form.Item>
            <Form.Item name={[roleId, `${itemPrefix}_delete`]} valuePropName="checked" noStyle>
                <Checkbox />
            </Form.Item>
        </div>
    );



    const featureToPrefixMap = {
        'Quản lý bài viết': 'posts',
        'Quản lý danh mục bài viết': 'posts-category',
        'Quản lý nhóm quyền': 'roles',
        'Quản lý tài khoản': 'accounts',
    };
    const columns = [
        {
            title: 'Chức năng',
            dataIndex: 'feature',
            render: (text) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span><strong>{text}</strong></span>
                    <span>Xem</span>
                    <span>Thêm mới</span>
                    <span>Chỉnh sửa</span>
                    <span>Xóa</span>
                </div>
            ),
        },
        ...records.map(record => ({
            title: record.title,
            dataIndex: record._id,
            render: (text, recordData) => {
                const itemPrefix = featureToPrefixMap[recordData.feature];

                if(!itemPrefix) return null;

                return renderCheckboxes(itemPrefix, record._id);
            },
        })),
    ];




    const dataSource = [
        {
            key: '1',
            feature: 'Quản lý bài viết', // Thay 'posts' bằng 'Quản lý bài viết'
        },
        {
            key: '2',
            feature: 'Quản lý danh mục bài viết', // Thay 'posts-category' bằng 'Quản lý danh mục bài viết'
        },
        {
            key: '3',
            feature: 'Quản lý nhóm quyền', // Thay 'roles' bằng 'Quản lý nhóm quyền'
        },
        {
            key: '4',
            feature: 'Quản lý tài khoản', // Thay 'accounts' bằng 'Quản lý tài khoản'
        },
    ];



    return (
        <div className="page-inner">
            <Card title="Phân quyền" bordered={false}>
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Table
                        rowKey="_id"
                        columns={columns}
                        dataSource={dataSource}
                        pagination={false}
                    />
                    <Button type="primary" htmlType="submit" className="mt-3">
                        Cập nhật
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default PermissionForm;
