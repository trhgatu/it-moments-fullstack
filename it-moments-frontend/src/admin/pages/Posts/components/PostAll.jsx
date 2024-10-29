import React, { useState, useEffect } from 'react';
import { Row, Col, notification, Modal, Spin } from "antd";
import PostsCard from './PostsCard';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../../context/UserContext';
import { API_URL } from '../../../../config/config';
import axios from 'axios';

function PostsAll() {
  const { user, loading: userLoading } = useUser();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [actionType, setActionType] = useState('');
  const [filterValue, setFilterValue] = useState('');

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPage: 1,
    pageSize: 6,
    limitItems: 10,
  });

  const showNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      duration: 5,
      placement: 'topRight',
    });
  };

  const getToken = () => {
    const token = user?.token;
    if (!token) {
      setError('Token không hợp lệ.');
      return null;
    }
    return token;
  };

  const fetchPosts = async () => {
    setLoadingPosts(true);
    setError(null);
    const token = getToken();
    if (!token) {
      setLoadingPosts(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/admin/posts?page=${pagination.currentPage}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true,
      });

      const data = response.data;
      if (!data?.data?.posts) {
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
      showNotification('error', 'Lỗi', 'Không thể lấy dữ liệu bài viết.');
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    if (!userLoading && user) {
      fetchPosts();
    }
  }, [pagination.currentPage, userLoading, user]);

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
    const token = getToken();
    if (!token) return;

    if (selectedRowKeys.length === 0) {
      setError('Vui lòng chọn ít nhất một bài viết.');
      return;
    }

    if (!actionType) {
      setError('Vui lòng chọn loại hành động.');
      return;
    }

    try {
      await axios.patch(`${API_URL}/admin/posts/change-status-multi`, {
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

      showNotification('success', 'Thành công!', `${selectedRowKeys.length} bài viết đã được thay đổi trạng thái thành công.`);
    } catch (error) {
      console.error('Error performing batch action:', error);
      setError('Unable to perform the action.');
    }
  };

  const handleDeletePost = async (postId) => {
    const token = getToken();
    if (!token) return;

    try {
      await axios.delete(`${API_URL}/admin/posts/delete/${postId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      });

      showNotification('success', 'Thành công!', 'Bài viết đã được xóa thành công.');
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
          {loadingPosts || userLoading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Spin tip="Đang tải dữ liệu..." />
            </div>
          ) : (
            <PostsCard
              posts={filteredPosts}
              loading={loadingPosts}
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
          )}
        </Col>
      </Row>
    </div>
  );
}

export default PostsAll;
