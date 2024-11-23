import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../../config/config';
import { useUser } from '../../../context/UserContext';

const EditRole = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [form] = Form.useForm();
    const { user } = useUser();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchRoleDetails = async () => {
            const token = user?.token;
            if (!token) {
                message.error('Token không hợp lệ. Vui lòng đăng nhập lại.');
                return;
            }

            try {
                const response = await axios.get(`${API_URL}/admin/roles/detail/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    withCredentials: true,
                });

                if (response.data.success) {
                    const role = response.data.data;
                    // Set các giá trị vào form
                    form.setFieldsValue({
                        title: role.title,
                        description: role.description,
                    });
                } else {
                    message.error('Không thể tải thông tin nhóm quyền.');
                }
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu nhóm quyền:', error);
                message.error('Có lỗi xảy ra khi tải thông tin nhóm quyền.');
            }
        };

        fetchRoleDetails();
    }, [id, user?.token, form]);

    const onFinish = async (values) => {
        const token = user?.token;
        if (!token) {
            message.error('Token không hợp lệ. Vui lòng đăng nhập lại.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.patch(
                `${API_URL}/admin/roles/edit/${id}`,
                {
                    title: values.title,
                    description: values.description || '',
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

            if (response.data.success) {
                message.success('Nhóm quyền đã được cập nhật thành công!');
                navigate('/admin/roles');
            } else {
                message.error(response.data.message || 'Có lỗi xảy ra khi cập nhật nhóm quyền.');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật nhóm quyền:', error);
            message.error('Có lỗi xảy ra khi cập nhật nhóm quyền.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-inner">
            <Card title="Chỉnh sửa Nhóm quyền" bordered={false}>
                <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ title: '', description: '' }}>
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
                        <Button type="primary" htmlType="submit" loading={loading}>Cập nhật</Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default EditRole;
