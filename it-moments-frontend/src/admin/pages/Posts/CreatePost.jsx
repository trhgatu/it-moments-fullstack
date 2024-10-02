import React, { useState } from 'react';
import { Card, Form, Input, Button, Select, Upload, message, Radio } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const CreatePost = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [thumbnailFileList, setThumbnailFileList] = useState([]);
    const [imageFileList, setImageFileList] = useState([]);
    const [videoURL, setVideoURL] = useState('');

    const handleThumbnailChange = (info) => {
        setThumbnailFileList(info.fileList);
    };

    const handleImageChange = (info) => {
        setImageFileList(info.fileList);
    };

    const handleVideoURLChange = (e) => {
        setVideoURL(e.target.value);
    };

    const onFinish = async (values) => {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('post_category_id', values.post_category_id);
        formData.append('description', values.description);

        const positionValue = values.position ? parseInt(values.position) : '';
        formData.append('position', positionValue);

        formData.append('status', values.status);
        formData.append('video', videoURL);

        if(thumbnailFileList.length > 0) {
            formData.append('thumbnail', thumbnailFileList[0].originFileObj);
        }
        imageFileList.forEach(file => {
            formData.append('images', file.originFileObj);
        });

        try {
            await axios.post(`http://localhost:3000/api/v1/admin/posts/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });
            message.success('Bài viết đã được tạo thành công!');
            navigate('/admin/posts');
        } catch(error) {
            console.error('Lỗi khi tạo bài viết:', error);
            message.error('Có lỗi xảy ra khi tạo bài viết.');
        }
    };


    return (
        <div className="page-inner">
            <Card title="Tạo bài viết" bordered={false}>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
                        <Input placeholder="Nhập tiêu đề" />
                    </Form.Item>

                    <Form.Item label="Danh mục" name="post_category_id">
                        <Select placeholder="---- Chọn danh mục ----">
                            {/* Option categories should be populated dynamically */}
                            <Option value="category1">Danh mục 1</Option>
                            <Option value="category2">Danh mục 2</Option>
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

                    <Form.Item label="Thư viện ảnh" name="images">
                        <Upload
                            accept="image/*"
                            fileList={imageFileList}
                            onChange={handleImageChange}
                            multiple
                            beforeUpload={() => false} // Prevent auto-upload
                        >
                            <Button icon={<UploadOutlined />}>Tải lên ảnh</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item label="Video URL" name="video">
                        <Input
                            placeholder="Nhập URL video YouTube"
                            value={videoURL}
                            onChange={handleVideoURLChange}
                        />
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

export default CreatePost;
