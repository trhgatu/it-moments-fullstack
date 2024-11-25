import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Select, Upload, message, Radio, Checkbox, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useUser } from '../../../context/UserContext';
import { API_URL } from '../../../config/config';
const { Option } = Select;

const PostEdit = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const { id } = useParams(); // Lấy id bài viết từ URL
    const [form] = Form.useForm();
    const [thumbnailFileList, setThumbnailFileList] = useState([]);
    const [imageFileList, setImageFileList] = useState([]);
    const [videoURL, setVideoURL] = useState('');
    const [categories, setCategories] = useState([]);
    const [events, setEvents] = useState([]);
    const [isFeatured, setIsFeatured] = useState(false);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        const fetchCategoriesAndEvents = async () => {
            const token = user?.token;
            try {
                const categoriesResponse = await axios.get(`${API_URL}/admin/post-categories`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                    withCredentials: true,
                });
                setCategories(categoriesResponse.data.data.categories || []);
                const eventsResponse = await axios.get(`${API_URL}/admin/events`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                    withCredentials: true,
                });
                setEvents(eventsResponse.data.data.events || []);
            } catch(error) {
                message.error('Có lỗi xảy ra khi lấy dữ liệu danh mục hoặc sự kiện.');
            }
        };

        const fetchPostData = async () => {
            const token = user?.token;
            try {
                const response = await axios.get(`${API_URL}/admin/posts/detail/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                });
                console.log(response.data.data)
                const post = response.data.data;
                if(post) {
                    form.setFieldsValue({
                        title: post.title,
                        post_category_id: post.post_category_id?._id,
                        event_id: post.event_id?._id,
                        description: post.description,
                        position: post.position,
                        status: post.status,
                        video: post.video
                    });
                    setVideoURL(post.video);
                    setIsFeatured(post.isFeatured || false);
                    if(post.thumbnail) {
                        setThumbnailFileList([
                            {
                                uid: '-1',
                                name: 'Ảnh bìa hiện tại',
                                status: 'done',
                                url: post.thumbnail,
                            },
                        ]);
                    }
                    if(post.images && post.images.length > 0) {
                        setImageFileList(
                            post.images.map((image, index) => ({
                                uid: `-${index + 1}`,
                                name: `Ảnh ${index + 1}`,
                                status: 'done',
                                url: image,
                            }))
                        );
                    }
                }
            } catch(error) {
                message.error('Có lỗi xảy ra khi lấy dữ liệu bài viết.');
            } finally {
                setInitialLoading(false);
            }
        };

        fetchCategoriesAndEvents();
        fetchPostData();
    }, [id, user, form]);

    const handleThumbnailChange = (info) => {
        setThumbnailFileList(info.fileList);
    };
    const handleThumbnailRemove = (file) => {
        // Khi xóa ảnh, thay đổi thumbnailFileList
        setThumbnailFileList((prevFileList) => {
            const newFileList = prevFileList.filter(item => item.uid !== file.uid);
            // Nếu ảnh bị xóa, gán giá trị `null` vào để gửi lên server
            if(newFileList.length === 0) {
                form.setFieldsValue({ thumbnail: null });
            }
            return newFileList;
        });
    };

    const handleImageChange = (info) => {
        setImageFileList(info.fileList);
    };
    const handleImageRemove = (file) => {
        // Khi xóa ảnh, thay đổi imageFileList
        setImageFileList((prevFileList) => {
            const newFileList = prevFileList.filter(item => item.uid !== file.uid);
            // Nếu ảnh bị xóa, gán giá trị `null` vào để gửi lên server
            if(newFileList.length === 0) {
                form.setFieldsValue({ images: null });
            }
            return newFileList;
        });
    };
    const handleVideoURLChange = (e) => {
        setVideoURL(e.target.value);
    };

    const onFinish = async (values) => {
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

        if (thumbnailFileList.length > 0 && thumbnailFileList[0].originFileObj) {
            formData.append('thumbnail', thumbnailFileList[0].originFileObj);
        } else if (thumbnailFileList.length === 0 && !form.getFieldValue('thumbnail')) {
            formData.append('thumbnail', null);
        }



        if (imageFileList.length > 0) {
            imageFileList.forEach(file => {
                if (file.originFileObj) {
                    formData.append('images', file.originFileObj);
                }
            });
        } else {
            formData.append('images', []);
        }


        setLoading(true);
        try {
            const token = user?.token;
            if(!token) {
                message.error('Token không hợp lệ.');
                return;
            }
            await axios.patch(`${API_URL}/admin/posts/edit/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true,
            });
            message.success('Bài viết đã được cập nhật thành công!');
            navigate('/admin/posts');
        } catch(error) {
            console.error('Lỗi khi cập nhật bài viết:', error);
            message.error('Có lỗi xảy ra khi cập nhật bài viết.');
        } finally {
            setLoading(false);
        }
    };

    if(initialLoading) {
        return <Spin size="large" style={{ display: 'block', margin: '20% auto' }} />;
    }

    return (
        <div className="page-inner">
            <Card title="Chỉnh sửa bài viết" bordered={false}>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
                        <Input placeholder="Nhập tiêu đề" />
                    </Form.Item>

                    <Form.Item
                        label="Danh mục"
                        name="post_category_id"
                        rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                    >
                        <Select placeholder="---- Chọn danh mục ----">
                            {categories.map((category) => (
                                <Option key={category._id} value={category._id}>
                                    {category.title}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>


                    <Form.Item label="Sự kiện" name="event_id" rules={[{ required: true, message: 'Vui lòng chọn sự kiện!' }]}>
                        <Select placeholder="---- Chọn sự kiện ----">
                            {events.map((event) => (
                                <Option key={event._id} value={event._id}>
                                    {event.title}
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
                            beforeUpload={() => false}
                            listType="picture"
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
                            listType="picture"
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
                            {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default PostEdit;
