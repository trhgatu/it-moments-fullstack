import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Radio, Table, Button, Avatar, Typography, Alert, Input } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../components/PrivateRoutes';
import Pagination from '../../components/Pagination';
import moment from 'moment';

const { Title } = Typography;

function PostsAll() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPage: 1,
    pageSize: 6,
    limitItems: 10,
  });

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      const token = getCookie('token');
      try {
        const response = await fetch(`http://localhost:3000/api/v1/admin/posts?page=${pagination.currentPage}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include',
        });

        const data = await response.json();
        console.log(data);  // Check the data returned from the backend

        if (!data || !data.data || !data.data.posts) {
          throw new Error('Invalid data format');
        }

        setPosts(data.data.posts);
        setPagination((prev) => ({
          ...prev,
          totalPage: data.data.pagination.totalPage || 1,
          currentPage: data.data.pagination.currentPage,
          limitItems: data.data.pagination.limitItems || 10 // Ensure limitItems is set
        }));
      } catch (error) {
        console.error('Error fetching API:', error);
        setError('Unable to fetch post data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
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
      title: "Video",
      dataIndex: "video",
      key: "video",
      render: (video) => (video ? <a href={video} target="_blank" rel="noopener noreferrer">Xem Video</a> : 'Không có video'),
    },
    {
      title: "Vị trí",
      dataIndex: "position",
      key: "position",
      render: (text, record) => (
        <Input
          type="number"
          defaultValue={text}
          min={1}
          style={{ width: '60px' }}
          onChange={(e) => handlePositionChange(record._id, e.target.value)}
        />
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
      title: "Người tạo",
      key: "createdBy.accountFullName",
      render: (record) => (
        <b>{record.accountFullName}</b>
      ),
    },
    {
      title: "Người cập nhật",
      key: "updatedBy",
      render: (record) => {
        const updatedBy = record.updatedBy?.slice(-1)[0];
        return (
          <>
            {updatedBy ? (
              <>
                <p>{updatedBy.accountFullName}</p>
                <b>Lúc:</b>
                <p>{moment(updatedBy.updateAt).format('HH:mm:ss')}</p>
              </>
            ) : (
              <p>Chưa cập nhật</p>
            )}
          </>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/posts/detail/${record._id}`)}
          />
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/posts/edit/${record._id}`)}
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
            title="Danh sách bài viết"
            extra={
              <div>
                <Button type="primary" onClick={() => navigate('/admin/posts/create')}>
                  Tạo bài viết
                </Button>
                <Radio.Group defaultValue="">
                  <Radio.Button value="">Tất cả</Radio.Button>
                  <Radio.Button value="active">Hoạt động</Radio.Button>
                  <Radio.Button value="inactive">Dừng hoạt động</Radio.Button>
                </Radio.Group>
              </div>
            }
          >
            {error && <Alert message={error} type="error" showIcon />}
            <div className="table-responsive">
              <Table
                columns={columns}
                dataSource={posts}
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

export default PostsAll;
