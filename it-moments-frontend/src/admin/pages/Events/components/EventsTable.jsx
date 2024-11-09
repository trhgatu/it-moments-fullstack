import React from 'react';
import { Table, Avatar, Button } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

const EventsTable = ({ events, loading, selectedRowKeys, handleSelectChange, handleDeleteConfirm, navigate, pagination }) => {
  const columns = [
    {
      title: <input type="checkbox"
        checked={selectedRowKeys.length === events.length}
        onChange={(e) => handleSelectChange(e.target.checked ? events.map(event => event._id) : [])}
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
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let buttonProps = { type: "default" };
        if (status === "active") {
          buttonProps = { type: "primary", style: { backgroundColor: "green", borderColor: "green" } };
        } else if (status === "inactive") {
          buttonProps = { type: "default", style: { backgroundColor: "gray", borderColor: "gray" } };
        } else if (status === "completed") {
          buttonProps = { type: "default", style: { backgroundColor: "blue", borderColor: "blue" } };
        }

        const statusText = status === "active" ? "Hoạt động" :
                           status === "inactive" ? "Dừng hoạt động" :
                           "Đã kết thúc";

        return (
          <Button {...buttonProps}>
            {statusText}
          </Button>
        );
      },
    },

    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (startDate) => moment(startDate).format('DD/MM/YYYY'),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (endDate) => moment(endDate).format('DD/MM/YYYY'),
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
            onClick={() => navigate(`/admin/events/detail/${record._id}`)}
          />
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/events/edit/${record._id}`)}
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
      dataSource={events}
      loading={loading}
      rowKey="_id"
      pagination={false}
      className="ant-border-space"
    />
  );
};

export default EventsTable;
