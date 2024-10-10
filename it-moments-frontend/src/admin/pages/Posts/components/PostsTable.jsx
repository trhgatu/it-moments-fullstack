import React from 'react';
import { Table, Avatar, Button } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

const PostsTable = ({ posts, loading, selectedRowKeys, handleSelectChange, handleDeleteConfirm, navigate, pagination }) => {
  const columns = [
    {
      title: <input type="checkbox"
        checked={selectedRowKeys.length === posts.length}
        onChange={(e) => handleSelectChange(e.target.checked ? posts.map(post => post._id) : [])}
      />,
      key: "select",
      render: (_, record) => (
        <input
          type="checkbox"
          checked={selectedRowKeys.includes(record._id)}
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
            onClick={() => handleDeleteConfirm(record._id)}
          />
        </>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={posts}
      loading={loading}
      rowKey="_id"
      pagination={false}
      className="ant-border-space"
    />
  );
};

export default PostsTable;
