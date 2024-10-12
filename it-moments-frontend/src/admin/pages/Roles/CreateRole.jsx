import React, { useState } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateRole = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const onFinish = async (values) => {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('description', values.description);

        try {
            const response = await axios.post(`http://localhost:3000/api/v1/admin/roles/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });

            if (response.data.success) {
                message.success('Nhóm quyền đã được tạo thành công!');
                navigate('/admin/roles');
            } else {
                message.error('Có lỗi xảy ra khi tạo Nhóm quyền.');
            }
        } catch (error) {
            console.error('Lỗi khi tạo Nhóm quyền:', error);
            message.error('Có lỗi xảy ra khi tạo Nhóm quyền.');
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
