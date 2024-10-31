import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Avatar, Typography, Alert, message, Modal } from "antd"; // Import Modal
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import Pagination from '../../components/Pagination';
import moment from 'moment';
import axios from 'axios';
import { API_URL } from '../../../config/config';

const { Title } = Typography;

const fetchCategoriesData = async (currentPage, token) => {
    const response = await axios.get(`${API_URL}/admin/post-categories?page=${currentPage}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        withCredentials: true,
    });

    if (!response.data) {
        throw new Error('Lỗi khi lấy dữ liệu danh mục bài viết');
    }

    return response.data;
};

function CategoriesAll() {
    const navigate = useNavigate();
    const { user } = useUser();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPage: 1,
        pageSize: 6,
    });

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            setError(null);
            const token = user?.token;

            if (!token) {
                setError('Token không hợp lệ.');
                setLoading(false);
                return;
            }

            try {
                const data = await fetchCategoriesData(pagination.currentPage, token);
                if (data?.data?.categories) {
                    setCategories(data.data.categories);
                    setPagination((prev) => ({
                        ...prev,
                        totalPage: data.data.pagination.totalPage || 1,
                        currentPage: data.data.pagination.currentPage || 1,
                        pageSize: data.data.pagination.limitItems || prev.pageSize,
                    }));
                } else {
                    throw new Error('Invalid data format');
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                setError('Không thể lấy dữ liệu danh mục.');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, [pagination.currentPage, user]);

    const handlePageChange = (page) => {
        setPagination((prev) => ({
            ...prev,
            currentPage: page,
        }));
    };

    const handleDeleteConfirmation = (id) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa danh mục này?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: () => handleDeletePost(id),
        });
    };

    const handleDeletePost = async (id) => {
        const token = user?.token;

        if (!token) {
            setError('Token không hợp lệ.');
            return;
        }

        try {
            await axios.delete(`${API_URL}/admin/post-categories/delete/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                withCredentials: true,
            });
            setCategories((prev) => prev.filter((category) => category._id !== id));
            message.success('Danh mục đã được xóa thành công!');
        } catch (error) {
            console.error('Lỗi khi xóa danh mục:', error);
            setError('Có lỗi xảy ra khi xóa danh mục.');
        }
    };

    const columns = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            render: (_, __, index) => (pagination.currentPage - 1) * pagination.pageSize + index + 1,
        },
        {
            title: "Ảnh bìa",
            dataIndex: "thumbnail",
            key: "thumbnail",
            render: (thumbnail) => <Avatar shape="square" size={64} src={thumbnail} alt="Thumbnail" />,
        },
        {
            title: "Tiêu đề",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Button
                    type={status === "active" ? "primary" : "default"}
                    style={{ backgroundColor: status === "active" ? "green" : "transparent", borderColor: status === "active" ? "green" : "gray" }}
                >
                    {status === "active" ? "Hoạt động" : "Dừng hoạt động"}
                </Button>
            ),
        },
        {
            title: "Người tạo",
            dataIndex: "accountFullName",
            key: "accountFullName",
            render: (accountFullName) => <strong>{accountFullName}</strong>,
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (createdAt) => moment(createdAt).format('DD/MM/YYYY'),
        },
        {
            title: "Thao tác",
            key: "action",
            render: (_, record) => (
                <>
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`/admin/post-categories/detail/${record._id}`)}
                    />
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/admin/post-categories/edit/${record._id}`)}
                    />
                    <Button
                        type="link"
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => handleDeleteConfirmation(record._id)} // Call the confirmation dialog
                    />
                </>
            ),
        },
    ];

    return (
        <div className="tabled">
            <Row gutter={[24, 0]}>
                <Col xs={24}>
                    <Card
                        bordered={false}
                        className="criclebox tablespace mb-24"
                        title="Danh sách danh mục bài viết"
                        extra={
                            <Button type="primary" onClick={() => navigate('/admin/post-categories/create')}>
                                Tạo danh mục mới
                            </Button>
                        }
                    >
                        {error && <Alert message={error} type="error" showIcon />}
                        <div className="table-responsive">
                            <Table
                                columns={columns}
                                dataSource={categories}
                                loading={loading}
                                rowKey="_id"
                                pagination={false}
                                className="ant-border-space"
                            />
                        </div>
                        <Pagination pagination={pagination} onPageChange={handlePageChange} />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default CategoriesAll;
