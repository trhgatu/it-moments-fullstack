import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Select, Upload, message, Radio } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { getCookie } from '../../../admin/components/PrivateRoutes';

const { Option } = Select;

const CreateCategory = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [thumbnailFileList, setThumbnailFileList] = useState([]);
    const [parentCategories, setParentCategories] = useState([]);

    const fetchParentCategories = async () => {
        const token = getCookie('token');
        try {
            const response = await axios.get(`http://localhost:3000/api/v1/admin/post-categories`, {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                withCredentials: true,
              });
            setParentCategories(response.data.data.categories);
        } catch (error) {
            console.error('Lỗi khi lấy danh mục cha:', error);
            message.error('Có lỗi xảy ra khi lấy danh mục cha.');
        }
    };

    useEffect(() => {
        fetchParentCategories(); // Gọi hàm để lấy danh mục cha khi component mount
    }, []);

    const handleThumbnailChange = (info) => {
        setThumbnailFileList(info.fileList);
    };

    const onFinish = async (values) => {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('parent_id', values.parent_id); // Thêm parent_id cho danh mục cha
        formData.append('description', values.description);

        const positionValue = values.position ? parseInt(values.position) : '';
        formData.append('position', positionValue);

        formData.append('status', values.status);

        if (thumbnailFileList.length > 0) {
            formData.append('thumbnail', thumbnailFileList[0].originFileObj);
        }

        try {
            await axios.post(`http://localhost:3000/api/v1/admin/post-categories/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });
            message.success('Danh mục đã được tạo thành công!');
            navigate('/admin/posts-categories');
        } catch (error) {
            console.error('Lỗi khi tạo danh mục:', error);
            message.error('Có lỗi xảy ra khi tạo danh mục.');
        }
    };

    return (
        <div className="page-inner">
            <Card title="Tạo danh mục" bordered={false}>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
                        <Input placeholder="Nhập tiêu đề" />
                    </Form.Item>

                    <Form.Item label="Danh mục cha" name="parent_id">
                        <Select placeholder="---- Chọn danh mục cha ----">
                            <Option value="">Không có danh mục cha</Option>
                            {parentCategories.map(category => (
                                <Option key={category._id} value={category._id}>
                                    {category.title}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Mô tả" name="description">
                        <Input.TextArea rows={5} placeholder="Nhập mô tả" />
                    </Form.Item>

                    <Form.Item label="Ảnh" name="thumbnail">
                        <Upload
                            accept="image/*"
                            fileList={thumbnailFileList}
                            onChange={handleThumbnailChange}
                            beforeUpload={() => false} // Prevent auto-upload
                        >
                            <Button icon={<UploadOutlined />}>Tải lên ảnh bìa</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item label="Vị trí" name="position">
                        <Input type="number" min={1} placeholder="Nhập vị trí" />
                    </Form.Item>

                    <Form.Item label="Trạng thái" name="status" initialValue="active">
                        <Radio.Group>
                            <Radio value="active">Hoạt động</Radio>
                            <Radio value="inactive">Dừng hoạt động</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">Tạo mới</Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default CreateCategory;