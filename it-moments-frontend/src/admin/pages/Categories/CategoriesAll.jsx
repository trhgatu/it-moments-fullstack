import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Avatar, Typography, Alert } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../components/PrivateRoutes';
import Pagination from '../../components/Pagination';
import moment from 'moment';

const { Title } = Typography;

const fetchCategoriesData = async (currentPage) => {
  const token = getCookie('token');
  const response = await fetch(`http://localhost:3000/api/v1/admin/post-categories?page=${currentPage}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    credentials: 'include',
  });

  if(!response.ok) {
    throw new Error('Failed to fetch categories data');
  }

  return response.json();
};

function CategoriesAll() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPage: 1,
    pageSize: 6,
    limitItems: 10
  });

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCategoriesData(pagination.currentPage);
        if(data?.data?.categories) {
          setCategories(data.data.categories);
          setPagination((prev) => ({
            ...prev,
            totalPage: data.data.pagination.totalPage || 1,
            currentPage: data.data.pagination.currentPage || 1,
            pageSize: data.data.pagination.limitItems || prev.pageSize,
            limitItems: data.data.limitItems || 10
          }));
        } else {
          throw new Error('Invalid data format');
        }
      } catch(error) {
        console.error('Error fetching categories:', error);
        setError('Cannot retrieve categories data.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
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
            onClick={() => handleDeletePost(record._id)}
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
