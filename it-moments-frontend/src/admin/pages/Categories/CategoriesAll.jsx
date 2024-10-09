import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Avatar, Typography, Alert } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../components/PrivateRoutes';
import Pagination from '../../components/Pagination';
import moment from 'moment';

const { Title } = Typography;

function CategoriesAll() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]); // Thay đổi tên biến từ posts thành categories
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPage: 1,
    pageSize: 6,
    limitItems: 10,
  });

  useEffect(() => {
    const fetchCategories = async () => { // Đổi tên hàm để phù hợp với mục tiêu
      setLoading(true);
      setError(null);
      const token = getCookie('token');
      try {
        const response = await fetch(`http://localhost:3000/api/v1/admin/post-categories?page=${pagination.currentPage}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include',
        });

        const data = await response.json();
        console.log(data);  // Kiểm tra dữ liệu trả về từ backend

        if (!data || !data.data || !data.data.categories) { // Sửa lại để kiểm tra categories
          throw new Error('Định dạng dữ liệu không hợp lệ');
        }

        setCategories(data.data.categories); // Cập nhật trạng thái bằng categories
        setPagination((prev) => ({
          ...prev,
          totalPage: data.data.pagination.totalPage || 1,
          currentPage: data.data.pagination.currentPage,
          limitItems: data.data.pagination.limitItems || 10
        }));
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
        setError('Không thể lấy dữ liệu danh mục.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories(); // Gọi hàm fetchCategories
  }, [pagination.currentPage]);

  const handlePageChange = (page) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => (pagination.currentPage - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Ảnh bìa",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (thumbnail) => (
        <Avatar shape="square" size={64} src={thumbnail} alt="Thumbnail" />
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Button
          type={status === "active" ? "primary" : "default"}
          style={status === "active" ? { backgroundColor: "green", borderColor: "green" } : {}}
        >
          {status === "active" ? "Hoạt động" : "Dừng hoạt động"}
        </Button>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => new Date(createdAt).toLocaleDateString(),
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
            onClick={() => handleDeletePost(record._id)}
          />
        </>
      ),
    },
  ];

  return (
    <div className="tabled">
      <Row gutter={[24, 0]}>
        <Col xs="24" xl={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title="Danh sách danh mục bài viết"
            extra={
              <Button type="primary" onClick={() => navigate('/admin/posts/create')}>
                Tạo bài viết
              </Button>
            }
          >
            {error && <Alert message={error} type="error" showIcon />}
            <div className="table-responsive">
              <Table
                columns={columns}
                dataSource={categories} // Cập nhật để sử dụng categories
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
