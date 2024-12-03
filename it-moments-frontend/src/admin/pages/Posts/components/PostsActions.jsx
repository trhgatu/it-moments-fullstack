import React, { useState } from 'react';
import { Button, Select, Input } from 'antd';

const { Option } = Select;

const PostsActions = ({ error, actionType, setActionType, selectedRowKeys, handleActionSubmit, onSearch }) => {
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handleSearchSubmit = (value) => {
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="p-10">
      {error && (
        <div className="mb-4 p-4 text-red-800 bg-red-100 border border-red-300 rounded" role="alert">
          <strong className="font-bold">Lỗi:</strong> {error}
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Select
            placeholder="-- Chọn hành động --"
            value={actionType || undefined}
            onChange={(value) => setActionType(value)}
            className="w-80"
            dropdownStyle={{ minWidth: 200 }}
          >
            <Option value="active">Hoạt động</Option>
            <Option value="inactive">Dừng hoạt động</Option>
          </Select>

          <Button
            type="primary"
            onClick={handleActionSubmit}
            size="small"
            className="m-0 ml-11"
          >
            Áp dụng
          </Button>
        </div>

        {/* Ô tìm kiếm riêng biệt khỏi form */}
        <Input.Search
          placeholder="Tìm kiếm bài viết..."
          value={searchKeyword}
          onChange={handleSearchChange}
          onSearch={handleSearchSubmit}
          className="w-96"
        />
      </div>

      {/* Ẩn ID trong form (nếu cần) */}
      <input
        type="text"
        name="ids"
        value={selectedRowKeys.join(',')}
        className="hidden"
        readOnly
      />
    </div>
  );
};

export default PostsActions;
