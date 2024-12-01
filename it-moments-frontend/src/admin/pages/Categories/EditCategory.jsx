import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Select, message, Radio } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../../../context/UserContext';
import { API_URL } from '../../../config/config';

const { Option } = Select;

const EditCategory = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [form] = Form.useForm();
    const [allCategories, setAllCategories] = useState([]);
    const { user } = useUser();
    const [loading, setLoading] = useState(false);

    const fetchCategories = async () => {
        const token = user?.token;
        if (!token) {
            message.error('Token không hợp lệ.');
            return;
        }

        try {
            const response = await axios.get(`${API_URL}/admin/post-categories`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                withCredentials: true,
            });
            setAllCategories(response.data.data.categories);
        } catch (error) {
            console.error('Lỗi khi lấy danh mục:', error);
            message.error('Có lỗi xảy ra khi lấy danh mục.');
        }
    };

    const fetchCategoryDetails = async () => {
        const token = user?.token;
        if (!token) {
            message.error('Token không hợp lệ.');
            return;
        }

        try {
            const response = await axios.get(`${API_URL}/admin/post-categories/detail/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                withCredentials: true,
            });

            const category = response.data.data;
            console.log('Category Details:', category);
            form.setFieldsValue({
                title: category.title,
                parent_id: category.parent_id || '',
                description: category.description,
                position: category.position,
                status: category.status,
                slug: category.slug || '',  // Thêm slug vào form để có thể chỉnh sửa
            });
        } catch (error) {
            console.error('Lỗi khi lấy thông tin danh mục:', error);
            message.error('Có lỗi xảy ra khi lấy thông tin danh mục.');
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchCategoryDetails();
    }, [user, id]);

    // Kiểm tra slug có trùng lặp không
    const checkSlugAvailability = async (slug) => {
        try {
            const token = user?.token;
            if (!token) {
                message.error('Token không hợp lệ.');
                return;
            }

            const response = await axios.get(`${API_URL}/admin/post-categories?slug=${slug}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                withCredentials: true,
            });

            // Kiểm tra nếu có danh mục trùng slug
            if (response.data.data.length > 0) {
                message.error('Slug này đã tồn tại.');
                return false;
            }
            return true;
        } catch (error) {
            console.error('Lỗi khi kiểm tra slug:', error);
            message.error('Có lỗi xảy ra khi kiểm tra slug.');
            return false;
        }
    };

    const updateCategory = async (formData) => {
        try {
            const token = user?.token;
            if (!token) {
                message.error('Token không hợp lệ.');
                return;
            }

            setLoading(true);

            // Kiểm tra tính hợp lệ của slug
            if (!(await checkSlugAvailability(formData.slug))) {
                return; // Không tiếp tục nếu slug không hợp lệ
            }

            const response = await axios.patch(`${API_URL}/admin/post-categories/edit/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            fetchCategoryDetails();
            message.success('Danh mục đã được cập nhật thành công!');
        } catch (error) {
            console.error('Lỗi khi cập nhật danh mục:', error);
            message.error('Có lỗi xảy ra khi cập nhật danh mục.');
        } finally {
            setLoading(false);
        }
    };

    const onFinish = async (values) => {
        const data = {
            title: values.title,
            parent_id: values.parent_id || '',
            description: values.description,
            position: values.position ? parseInt(values.position) : '',
            status: values.status,
            slug: values.slug || slugify(values.title),  // Nếu slug trống, tự động sinh từ title
        };

        await updateCategory(data);
    };

    return (
        <div className="page-inner">
            <Card title="Chỉnh sửa danh mục" bordered={false}>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Tiêu đề"
                        name="title"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                    >
                        <Input placeholder="Nhập tiêu đề" />
                    </Form.Item>

                    <Form.Item label="Danh mục cha" name="parent_id">
                        <Select placeholder="---- Chọn danh mục cha ----">
                            <Option value="">Không có danh mục cha</Option>
                            {allCategories.map((category) => (
                                category._id !== id && (
                                    <Option key={category._id} value={category._id}>
                                        {category.title}
                                    </Option>
                                )
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Slug" name="slug">
                        <Input placeholder="Nhập slug" />
                    </Form.Item>

                    <Form.Item label="Mô tả" name="description">
                        <Input.TextArea rows={5} placeholder="Nhập mô tả" />
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
                            Cập nhật
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default EditCategory;
