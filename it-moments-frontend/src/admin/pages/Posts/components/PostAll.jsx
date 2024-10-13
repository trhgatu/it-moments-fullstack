import React, { useState, useEffect } from 'react';
import { Row, Col, notification, Modal } from "antd";
import { getCookie } from '../../../components/PrivateRoutes';
import PostsCard from './PostsCard'; // Import the new PostsCard component
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function PostsAll() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [actionType, setActionType] = useState('');
  const [filterValue, setFilterValue] = useState(''); // Thêm state cho bộ lọc

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPage: 1,
    pageSize: 6,
    limitItems: 10,
  });

  const openNotification = (message, description) => {
    notification.success({
      message,
      description,
      duration: 5,
      placement: 'topRight',
    });
  };

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
        withCredentials: true,
      });

      const data = response.data;

      if (!data || !data.data || !data.data.posts) {
        throw new Error('Invalid data format');
      }

      setPosts(data.data.posts);
      setPagination((prev) => ({
        ...prev,
        totalPage: data.data.pagination.totalPage || 1,
        currentPage: data.data.pagination.currentPage,
        limitItems: data.data.pagination.limitItems || 10
      }));
    } catch (error) {
      console.error('Error fetching API:', error);
      setError('Unable to fetch post data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [pagination.currentPage]);


  const filteredPosts = posts.filter(post => {
    if (filterValue === '') return true;
    return post.status === filterValue;
  });

  const handlePageChange = (page) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };

  const handleSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys);
  };

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    const token = getCookie('token');

    if (selectedRowKeys.length === 0) {
      setError('Vui lòng chọn ít nhất một bài viết.');
      return;
    }

    if (!actionType) {
      setError('Vui lòng chọn loại hành động.');
      return;
    }

    try {
      const response = await axios.patch('http://localhost:3000/api/v1/admin/posts/change-status-multi', {
        ids: selectedRowKeys,
        key: 'status',
        value: actionType
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      });

      setSelectedRowKeys([]);
      setActionType('');

      await fetchPosts();

      openNotification('Thành công!', `${selectedRowKeys.length} bài viết đã được thay đổi trạng thái thành công.`);
    } catch (error) {
      console.error('Error performing batch action:', error);
      setError('Unable to perform the action.');
    }
  };

  const handleDeletePost = async (postId) => {
    const token = getCookie('token');
    try {
      const response = await axios.delete(`http://localhost:3000/api/v1/admin/posts/delete/${postId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      });

      openNotification('Thành công!', 'Bài viết đã được xóa thành công.');
      await fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Không thể xóa bài viết.');
    }
  };

  const handleDeleteConfirm = (postId) => {
    Modal.confirm({
      title: 'Xác nhận xóa bài viết',
      content: 'Bạn có chắc chắn muốn xóa bài viết này không?.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => handleDeletePost(postId),
    });
  };

  return (
    <div className="tabled">
      <Row gutter={[24, 0]}>
        <Col xs="24" xl={24}>
          <PostsCard
            posts={filteredPosts}
            loading={loading}
            error={error}
            selectedRowKeys={selectedRowKeys}
            handleSelectChange={handleSelectChange}
            handleDeleteConfirm={handleDeleteConfirm}
            navigate={navigate}
            pagination={pagination}
            actionType={actionType}
            setActionType={setActionType}
            handleActionSubmit={handleActionSubmit}
            handlePageChange={handlePageChange}
            filterValue={filterValue}
            setFilterValue={setFilterValue}
          />
        </Col>
      </Row>
    </div>
  );
}

export default PostsAll;
