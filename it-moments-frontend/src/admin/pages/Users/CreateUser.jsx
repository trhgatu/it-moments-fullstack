import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Select, Upload, message, Radio, Checkbox } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useUser } from '../../../context/UserContext';
import { API_URL } from '../../../config/config';

const { Option } = Select;

const CreateUser = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState('user');
    const [avatarFileList, setAvatarFileList] = useState([]);
    const { user } = useUser();

    // Fetching roles from API
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const token = user?.token;
                if(!token) {
                    message.error('Token không hợp lệ.');
                    return;
                }
                const response = await axios.get(`${API_URL}/admin/roles`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
                setRoles(response.data.records || []);
            } catch(error) {
                console.error('Lỗi khi lấy danh sách roles:', error);
                message.error('Không thể lấy danh sách roles.');
            }
        };
        fetchRoles();
    }, [user]);

    // Handle avatar upload
    const handleAvatarChange = (info) => {
        setAvatarFileList(info.fileList);
    };

    // Function to upload form data
    const uploadAvatar = async (formData) => {
        try {
            const token = user?.token;
            if (!token) {
                message.error('Token không hợp lệ.');
                return;
            }

            await axios.post(`${API_URL}/admin/users/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
                withCredentials: true,
            });

            message.success('Người dùng đã được tạo thành công!');
            navigate('/admin/users');
        } catch (error) {
            console.error('Lỗi khi tạo người dùng:', error);
            console.error('Error Response:', error.response?.data);
            message.error('Có lỗi xảy ra khi tạo người dùng.');
        }
    };

    // Form submit handler
    const onFinish = async (values) => {
        const formData = new FormData();
        formData.append('fullName', values.fullName);
        formData.append('email', values.email);
        formData.append('password', values.password);
        formData.append('bio', values.bio);
        formData.append('status', values.status);
        formData.append('isVerified', values.isVerified);
        formData.append('isAdmin', values.isAdmin);

        // Handle role selection - Sửa từ 'role' thành 'role_id'
        if (values.role && values.role_id) {
            formData.append('role_id', values.role_id); // Gửi role_id đúng cách
        } else {
            formData.append('role_id', ''); // Nếu không có role, gán giá trị rỗng
        }

        // Add avatar file to form data
        if (avatarFileList.length > 0) {
            formData.append('avatar', avatarFileList[0].originFileObj);
        }

        await uploadAvatar(formData);
    };


    return (
        <div className="page-inner">
            <Card title="Tạo người dùng" bordered={false}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        fullName: '',
                        email: '',
                        bio: '',
                        status: 'active',
                        role: 'user',  // Default role
                        isVerified: false,
                        isAdmin: false,
                    }}
                >
                    {/* Full Name */}
                    <Form.Item
                        label="Họ tên"
                        name="fullName"
                        rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                    >
                        <Input placeholder="Nhập họ tên" />
                    </Form.Item>

                    {/* Email */}
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}
                    >
                        <Input placeholder="Nhập email" />
                    </Form.Item>

                    {/* Password */}
                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu" />
                    </Form.Item>

                    {/* Bio */}
                    <Form.Item label="Tiểu sử" name="bio">
                        <Input.TextArea rows={5} placeholder="Nhập tiểu sử" />
                    </Form.Item>

                    {/* Admin Permission */}
                    <Form.Item label="Quyền Admin" name="isAdmin" valuePropName="checked">
                        <Checkbox>Quyền truy cập Admin</Checkbox>
                    </Form.Item>

                    {/* Role Dropdown */}
                    <Form.Item label="Vai trò" name="role" rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}>
                        <Select
                            placeholder="Chọn vai trò"
                            onChange={(value) => setSelectedRole(value)}
                            value={selectedRole}
                        >
                            <Option value="admin">Admin</Option>
                            <Option value="user">User</Option>
                        </Select>
                    </Form.Item>

                    {/* Role ID Dropdown for Admin */}
                    {selectedRole === 'admin' && (
                        <Form.Item
                            label="Role ID"
                            name="role_id"
                            rules={[{ required: true, message: 'Vui lòng chọn Role ID!' }]}
                        >
                            <Select
                                placeholder="Chọn Role ID"
                                onChange={(value) => {
                                    const selectedRole = roles.find(role => role._id === value);
                                    message.info(`Quyền của Role: ${selectedRole?.permissions.join(', ')}`);
                                }}
                            >
                                {roles.map((role) => (
                                    <Option key={role._id} value={role._id}>
                                        {role.title} - {role.description}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    )}

                    {/* Display Permissions of selected Role */}
                    <div>
                        {roles.map((role) =>
                            selectedRole === 'admin' && role._id === form.getFieldValue('role_id') ? (
                                <ul key={role._id}>
                                    {role.permissions.map((perm) => (
                                        <li key={perm}>{perm}</li>
                                    ))}
                                </ul>
                            ) : null
                        )}
                    </div>

                    {/* Avatar Upload */}
                    <Form.Item label="Ảnh đại diện" name="avatar">
                        <Upload
                            accept="image/*"
                            fileList={avatarFileList}
                            onChange={handleAvatarChange}
                            beforeUpload={() => false}
                        >
                            <Button icon={<UploadOutlined />}>Tải lên ảnh đại diện</Button>
                        </Upload>
                    </Form.Item>

                    {/* User Status */}
                    <Form.Item label="Trạng thái" name="status">
                        <Radio.Group>
                            <Radio value="active">Hoạt động</Radio>
                            <Radio value="inactive">Dừng hoạt động</Radio>
                        </Radio.Group>
                    </Form.Item>

                    {/* Email Verification */}
                    <Form.Item label="Xác thực email" name="isVerified" valuePropName="checked">
                        <Checkbox>Đã xác thực</Checkbox>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Tạo mới
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default CreateUser;
