import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Select, Upload, message, Radio, Checkbox, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useUser } from '../../../context/UserContext';
import { API_URL } from '../../../config/config';
const { Option } = Select;

const CreatePost = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [thumbnailFileList, setThumbnailFileList] = useState([]);
    const [imageFileList, setImageFileList] = useState([]);
    const [videoURL, setVideoURL] = useState('');
    const [categories, setCategories] = useState([]);
    const [events, setEvents] = useState([]); // Thêm state cho sự kiện
    const [isFeatured, setIsFeatured] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            const token = user?.token;
            try {
                const response = await axios.get(`${API_URL}/admin/post-categories`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                    withCredentials: true,
                });
                if (response.data && Array.isArray(response.data.data.categories)) {
                    setCategories(response.data.data.categories);
                } else {
                    message.error('Có lỗi xảy ra khi lấy danh mục.');
                }
            } catch (error) {
                message.error('Có lỗi xảy ra khi lấy danh mục.');
            }
        };

        const fetchEvents = async () => {
            const token = user?.token;
            try {
                const response = await axios.get(`${API_URL}/admin/events`, { // Giả định API của bạn là /admin/events
                    headers: { 'Authorization': `Bearer ${token}` },
                    withCredentials: true,
                });
                if (response.data && Array.isArray(response.data.data.events)) {
                    setEvents(response.data.data.events); // Lưu danh sách sự kiện vào state
                } else {
                    message.error('Có lỗi xảy ra khi lấy sự kiện.');
                }
            } catch (error) {
                message.error('Có lỗi xảy ra khi lấy sự kiện.');
            }
        };

        fetchCategories();
        fetchEvents(); // Gọi hàm lấy sự kiện
    }, [user]);

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
        if (thumbnailFileList.length === 0) {
            message.error('Vui lòng tải lên ảnh bìa.');
            return;
        }
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('post_category_id', values.post_category_id);
        formData.append('event_id', values.event_id);
        formData.append('description', values.description);
        const positionValue = values.position ? parseInt(values.position) : '';
        formData.append('position', positionValue);
        formData.append('status', values.status);
        formData.append('video', videoURL);
        formData.append('isFeatured', isFeatured);

        formData.append('thumbnail', thumbnailFileList[0].originFileObj);
        imageFileList.forEach(file => {
            formData.append('images', file.originFileObj);
        });

        setLoading(true);
        try {
            const token = user?.token;
            if (!token) {
                message.error('Token không hợp lệ.');
                return;
            }
            await axios.post(`${API_URL}/admin/posts/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true,
            });
            message.success('Bài viết đã được tạo thành công!');
            form.resetFields();
            setThumbnailFileList([]);
            setImageFileList([]);
            setVideoURL('');
            navigate('/admin/posts');
        } catch (error) {
            console.error('Lỗi khi tạo bài viết:', error);
            message.error('Có lỗi xảy ra khi tạo bài viết.');
            if (error.response) {
                message.error(`Lỗi từ máy chủ: ${error.response.data.message || 'Vui lòng thử lại.'}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-inner">
            <Card title="Tạo bài viết" bordered={false}>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
                        <Input placeholder="Nhập tiêu đề" />
                    </Form.Item>

                    <Form.Item label="Danh mục" name="post_category_id" rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}>
                        <Select placeholder="---- Chọn danh mục ----">
                            {categories.map(category => (
                                <Option key={category._id} value={category._id}>
                                    {category.title}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Sự kiện" name="event_id" rules={[{ required: true, message: 'Vui lòng chọn sự kiện!' }]}>
                        <Select placeholder="---- Chọn sự kiện ----">
                            {events.map(event => (
                                <Option key={event._id} value={event._id}>
                                    {event.title} {/* Hoặc bất kỳ thuộc tính nào mà bạn muốn hiển thị */}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Checkbox checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)}>
                            Hiển thị trên trang chủ
                        </Checkbox>
                    </Form.Item>

                    <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
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
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {loading ? 'Đang tạo...' : 'Tạo mới'}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default CreatePost;
