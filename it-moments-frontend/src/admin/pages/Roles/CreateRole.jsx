import React from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../../config/config';
import { useUser } from '../../../context/UserContext'; // Nhập useUser để lấy thông tin người dùng

const CreateRole = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { user } = useUser(); // Lấy thông tin người dùng từ context

    const onFinish = async (values) => {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('description', values.description || '');

        const token = user?.token; // Lấy token từ context
        if (!token) {
            message.error('Token không hợp lệ. Vui lòng đăng nhập lại.');
            return; // Ngăn không cho tiếp tục nếu token không hợp lệ
        }

        try {
            const response = await axios.post(`${API_URL}/admin/roles/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}` // Gửi token trong header
                },
                withCredentials: true,
            });

            // Kiểm tra phản hồi từ API
            if (response.data.success) { // Chỉnh sửa để kiểm tra success
                message.success('Nhóm quyền đã được tạo thành công!');
                navigate('/admin/roles');
            } else {
                message.error(response.data.message || 'Có lỗi xảy ra khi tạo Nhóm quyền.');
            }
        } catch (error) {
            console.error('Lỗi khi tạo Nhóm quyền:', error);
            message.error('Có lỗi xảy ra khi tạo Nhóm quyền.');
            if (error.response) {
                console.error('Lỗi từ máy chủ:', error.response.data);
            }
        }
    };

    return (
        <div className="page-inner">
            <Card title="Tạo Nhóm quyền" bordered={false}>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Tiêu đề"
                        name="title"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                    >
                        <Input placeholder="Nhập tiêu đề" />
                    </Form.Item>

                    <Form.Item label="Mô tả" name="description">
                        <Input.TextArea rows={5} placeholder="Nhập mô tả" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">Tạo mới</Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default CreateRole;
