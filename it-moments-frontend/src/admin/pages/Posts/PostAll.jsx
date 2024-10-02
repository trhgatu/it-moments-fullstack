import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Radio, Table, Button, Avatar, Typography, Alert, Input } from "antd";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { getCookie } from '../../components/PrivateRoutes';
const { Title } = Typography;

function PostsAll() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      const token = getCookie('token'); // Hàm lấy token từ cookie
      try {
        const response = await fetch('http://localhost:3000/api/v1/admin/posts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include',
        });
        if(!response.ok) {
          console.error('Error response:', response);
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if(!data || !data.data || !data.data.posts) {
          throw new Error('Invalid data format');
        }
        setPosts(data.data.posts);
      } catch(error) {
        console.error('Lỗi khi gọi API:', error);
        setError('Không thể lấy dữ liệu bài viết.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);


  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
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
          <Button type="link" onClick={() => navigate(`/admin/posts/detail/${record._id}`)}>
            Xem chi tiết
          </Button>
          <Button type="link" onClick={() => navigate(`/admin/posts/edit/${record._id}`)}>
            Chỉnh sửa
          </Button>
          <Button type="link" danger onClick={() => handleDeletePost(record._id)}>Xóa</Button>
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
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default PostsAll;
