import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Radio, Table, Button, Avatar, Typography, Alert, Input } from "antd";
import axios from 'axios';
const { Title } = Typography;
import moment from 'moment';
function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:3000/api/v1/admin/posts');
        setPosts(response.data.data.posts);
      } catch(error) {
        console.error('Lỗi khi gọi API:', error);
        setError('Không thể lấy dữ liệu bài viết.');
      }
      setLoading(false);
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
        <>
          <b>{record.accountFullName}</b>
        </>
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
        <Button type="link" href={`/posts/edit/${record._id}`}>Chỉnh sửa</Button>
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
              <Radio.Group defaultValue="">
                <Radio.Button value="">Tất cả</Radio.Button>
                <Radio.Button value="active">Hoạt động</Radio.Button>
                <Radio.Button value="inactive">Dừng hoạt động</Radio.Button>
              </Radio.Group>
            }
          >
            {error && <Alert message={error} type="error" showIcon />} {/* Hiển thị thông báo lỗi */}
            <div className="table-responsive">
              <Table
                columns={columns}
                dataSource={posts}
                loading={loading}
                rowKey="_id"
                pagination={false} // Có thể thêm phân trang nếu cần
                className="ant-border-space"
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Posts;
