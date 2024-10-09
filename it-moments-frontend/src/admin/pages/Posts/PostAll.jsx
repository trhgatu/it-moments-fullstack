import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Radio, Table, Avatar, Typography, Alert, Button, Input, notification } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../components/PrivateRoutes';
import Pagination from '../../components/Pagination';
import moment from 'moment';
import axios from 'axios'; // Import axios for API requests

const { Title } = Typography;

function PostsAll() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]); // State to hold posts
  const [loading, setLoading] = useState(false); // Loading state for fetching data
  const [error, setError] = useState(null); // Error state for handling errors
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // State for selected rows
  const [actionType, setActionType] = useState(''); // State for action type

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPage: 1,
    pageSize: 6,
    limitItems: 10,
  });

  // Function to display notification
  const openNotification = (message, description) => {
    notification.success({
      message,
      description,
      duration: 5, // Display duration
      placement: 'topRight', // Position of notification
    });
  };

  // Function to fetch posts from API
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    const token = getCookie('token');
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/admin/posts?page=${pagination.currentPage}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true, // To send cookies with request
      });

      const data = response.data;
      console.log(data); // Check the data returned from backend

      if(!data || !data.data || !data.data.posts) {
        throw new Error('Invalid data format');
      }

      setPosts(data.data.posts); // Set fetched posts
      setPagination((prev) => ({
        ...prev,
        totalPage: data.data.pagination.totalPage || 1,
        currentPage: data.data.pagination.currentPage,
        limitItems: data.data.pagination.limitItems || 10 // Ensure limitItems is set
      }));
    } catch(error) {
      console.error('Error fetching API:', error);
      setError('Unable to fetch post data.'); // Set error message
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(); // Fetch posts when component mounts
  }, [pagination.currentPage]);

  // Function to handle page change
  const handlePageChange = (page) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };

  // Function to handle selected rows
  const handleSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys);
    console.log(selectedKeys);
  };

  // Function to handle action submit
  const handleActionSubmit = async (e) => {
    e.preventDefault(); // Ngăn chặn hành động mặc định của form
    const token = getCookie('token');

    // Kiểm tra xem có bài viết nào được chọn không
    if(selectedRowKeys.length === 0) {
      setError('Vui lòng chọn ít nhất một bài viết.'); // Hiển thị thông báo lỗi nếu không có bài viết nào được chọn
      return; // Dừng thực thi hàm nếu không có bài viết nào được chọn
    }

    // Kiểm tra xem loại hành động có hợp lệ không
    if(!actionType) {
      setError('Vui lòng chọn loại hành động.'); // Hiển thị thông báo lỗi nếu loại hành động không được chọn
      return; // Dừng thực thi hàm nếu loại hành động không được chọn
    }

    try {
      const response = await axios.patch('http://localhost:3000/api/v1/admin/posts/change-status-multi', {
        ids: selectedRowKeys, // ID của các bài viết đã chọn
        key: 'status',        // Trường cần cập nhật
        value: actionType     // Giá trị mới để cập nhật cho các bài viết đã chọn
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true // Để gửi cookie cùng yêu cầu
      });

      const result = response.data;
      console.log(result); // Kiểm tra kết quả trả về từ server

      // Đặt lại danh sách đã chọn và loại hành động
      setSelectedRowKeys([]); // Đặt lại trạng thái đã chọn
      setActionType('');      // Đặt lại trạng thái loại hành động

      // Gọi lại fetchPosts để cập nhật dữ liệu
      await fetchPosts();

      // Hiển thị thông báo thành công
      openNotification('Thành công!', 'Thao tác của bạn đã được thực hiện thành công.');
    } catch(error) {
      console.error('Error performing batch action:', error);
      setError('Unable to perform the action.'); // Hiển thị thông báo lỗi nếu có sự cố
    }
  };


  // Define columns for the table
  const columns = [
    {
      title: <input type="checkbox"
        checked={selectedRowKeys.length === posts.length}
        onChange={(e) => handleSelectChange(e.target.checked ? posts.map(post => post._id) : [])}
      />, // Checkbox to select all
      key: "select",
      render: (_, record) => (
        <input
          type="checkbox"
          checked={selectedRowKeys.includes(record._id)} // Check if the post is selected
          onChange={(e) => handleSelectChange(e.target.checked ? [...selectedRowKeys, record._id] : selectedRowKeys.filter(key => key !== record._id))}
        />
      ),
    },
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => {
        const currentIndex = (pagination.currentPage - 1) * pagination.pageSize + index + 1;
        console.log(`Current index for post ${record._id}: ${currentIndex}`);
        return currentIndex;
      },
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
          onChange={(e) => handlePositionChange(record._id, e.target.value)} // Update position function needed
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
            onClick={() => handleDeletePost(record._id)} // Delete function needed
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
            {error && <Alert message={error} type="error" showIcon />} {/* Display error if exists */}
            <form onSubmit={handleActionSubmit} className="flex items-center mb-3">
              <div className="mr-2">
                <select
                  name="type"
                  className="border border-gray-300 rounded-md p-2"
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value)}
                >
                  <option value="" disabled>-- Chọn hành động --</option>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Dừng hoạt động</option>
                  {/* <option value="delete">Xóa</option> */}
                </select>
              </div>
              <input
                type="text"
                name="ids"
                value={selectedRowKeys.join(',')} // Hidden field for selected IDs
                className="hidden" // Hidden input
                readOnly // Read only
              />
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                Áp dụng
              </button>
            </form>
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
