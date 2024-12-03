import React from 'react';
import { Card, Button, Radio } from "antd";
import PostsTable from './PostsTable';
import PostsActions from './PostsActions';
import PaginationControl from './PaginationControl';

const PostsCard = ({
  posts,
  loading,
  error,
  selectedRowKeys,
  handleSelectChange,
  handleDeleteConfirm,
  handleSearch,
  navigate,
  pagination,
  actionType,
  setActionType,
  handleActionSubmit,
  handlePageChange,
  filterValue,
  setFilterValue,
}) => {
  const filteredPosts = posts.filter(post => {
    if (filterValue === '') return true;
    return post.status === filterValue;
  });

  return (
    <Card
      bordered={false}
      className="criclebox tablespace mb-24"
      title="Danh sách bài viết"
      extra={
        <div>
          <Button type="primary" onClick={() => navigate('/admin/posts/create')}>
            Tạo bài viết
          </Button>
          <Radio.Group value={filterValue} onChange={(e) => setFilterValue(e.target.value)}>
            <Radio.Button value="">Tất cả</Radio.Button>
            <Radio.Button value="active">Hoạt động</Radio.Button>
            <Radio.Button value="inactive">Dừng hoạt động</Radio.Button>
          </Radio.Group>
        </div>
      }
    >
      <PostsActions
        error={error}
        actionType={actionType}
        setActionType={setActionType}
        selectedRowKeys={selectedRowKeys}
        handleActionSubmit={handleActionSubmit}
        onSearch={handleSearch}
      />
      <div className="table-responsive">
        <PostsTable
          posts={filteredPosts}
          loading={loading}
          selectedRowKeys={selectedRowKeys}
          handleSelectChange={handleSelectChange}
          handleDeleteConfirm={handleDeleteConfirm}
          navigate={navigate}
          pagination={pagination}
        />
      </div>
      <PaginationControl
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </Card>
  );
};

export default PostsCard;
