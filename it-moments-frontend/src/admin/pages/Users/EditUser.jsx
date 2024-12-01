import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Select, Upload, message, Radio, Checkbox } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useUser } from '../../../context/UserContext';
import { API_URL } from '../../../config/config';

const { Option } = Select;

const EditUser = () => {
    const navigate = useNavigate();
    const { id } = useParams();  // Assuming you have the user's ID in the URL.
    const [form] = Form.useForm();
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState('user');
    const [avatarFileList, setAvatarFileList] = useState([]);
    const { user } = useUser();
    const [currentPermissions, setCurrentPermissions] = useState([]);
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const token = user?.token;
                if(!token) {
                    message.error('Token không hợp lệ.');
                    return;
                }
                const response = await axios.get(`${API_URL}/admin/roles`, {
                    headers: { Authorization: `Bearer ${token}` },
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
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = user?.token;
                if(!token) {
                    message.error('Token không hợp lệ.');
                    return;
                }

                const response = await axios.get(`${API_URL}/admin/users/detail/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                });

                const userData = response.data.data;

                form.setFieldsValue({
                    fullName: userData.fullName,
                    email: userData.email,
                    bio: userData.bio || '',
                    status: userData.status || 'active',
                    role: userData.isAdmin ? 'admin' : 'user',
                    role_id: userData.role_id || '',
                    isVerified: userData.isVerified || false,
                    isAdmin: userData.isAdmin || false,
                });

                setSelectedRole(userData.isAdmin ? 'admin' : 'user');
                setAvatarFileList(userData.avatar ? [{ url: userData.avatar }] : []);
            } catch(error) {
                console.error('Lỗi khi lấy thông tin người dùng:', error);
                message.error('Không thể lấy thông tin người dùng.');
            }
        };

        fetchUserDetails();
    }, [id, user, form]);

    const handleAvatarChange = (info) => {
        setAvatarFileList(info.fileList);
    };

    const updateUser = async (formData) => {
        try {
            const token = user?.token;
            if(!token) {
                message.error('Token không hợp lệ.');
                return;
            }

            await axios.patch(`${API_URL}/admin/users/edit/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            message.success('Người dùng đã được cập nhật thành công!');
            navigate('/admin/users');
        } catch(error) {
            console.error('Lỗi khi cập nhật người dùng:', error);
            message.error('Có lỗi xảy ra khi cập nhật người dùng.');
        }
    };

    const onFinish = async (values) => {
        const formData = new FormData();
        formData.append('fullName', values.fullName);
        formData.append('email', values.email);
        formData.append('password', values.password || '');
        formData.append('bio', values.bio);
        formData.append('status', values.status);
        formData.append('isVerified', values.isVerified);
        formData.append('isAdmin', values.isAdmin);
        if (values.role === 'admin' && values.role_id) {
            formData.append('role_id', values.role_id);
        }
        if (avatarFileList.length > 0) {
            formData.append('avatar', avatarFileList[0].originFileObj);
        }

        await updateUser(formData);
    };



    return (
        <div className="page-inner">
            <Card title="Chỉnh sửa người dùng" bordered={false}>
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
                    >
                        <Input.Password placeholder="Nhập mật khẩu (chỉ thay đổi nếu cần)" />
                    </Form.Item>

                    {/* Bio */}
                    <Form.Item label="Tiểu sử" name="bio">
                        <Input.TextArea rows={5} placeholder="Nhập tiểu sử" />
                    </Form.Item>

                    {/* Admin Permission */}
                    <Form.Item label="Quyền truy cập vào Trang quản trị" name="isAdmin" valuePropName="checked">
                        <Checkbox>Quyền truy cập</Checkbox>
                    </Form.Item>

                    {/* Role Dropdown */}
                    <Form.Item
                        label="Vai trò"
                        name="role"
                        rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                    >
                        <Select
                            placeholder="Chọn vai trò"
                            onChange={(value) => setSelectedRole(value)}
                            value={selectedRole}
                        >
                            <Option value="admin">Admin</Option>
                            <Option value="user">User</Option>
                        </Select>
                    </Form.Item>
                    {selectedRole === 'admin' && (
                        <Form.Item
                            label="Role ID"
                            name="role_id"
                            rules={[{ required: true, message: 'Vui lòng chọn Role ID!' }]}
                        >
                            <Select
                                placeholder="Chọn Role ID"
                                onChange={(value) => {
                                    const selectedRole = roles.find((role) => role._id === value);
                                    setCurrentPermissions(selectedRole?.permissions || []);
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
                            Cập nhật
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default EditUser;
