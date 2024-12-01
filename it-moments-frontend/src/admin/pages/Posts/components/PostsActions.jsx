import React, { useState } from 'react';
import { Button, Select, Input } from 'antd';

const { Option } = Select;

const PostsActions = ({ error, actionType, setActionType, selectedRowKeys, handleActionSubmit }) => {
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  return (
    <div className="p-10">
      {error && (
        <div className="mb-4 p-4 text-red-800 bg-red-100 border border-red-300 rounded" role="alert">
          <strong className="font-bold">Lỗi:</strong> {error}
        </div>
      )}
      <form onSubmit={handleActionSubmit} className="flex items-center justify-between">
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
            htmlType="submit"
            size="small"
            className="m-0 ml-11"
          >
            Áp dụng
          </Button>
        </div>

        <Input
          placeholder="Tìm kiếm..."
          value={searchKeyword}
          onChange={handleSearchChange}
          className="w-96"
        />

        <input
          type="text"
          name="ids"
          value={selectedRowKeys.join(',')}
          className="hidden"
          readOnly
        />
      </form>
    </div>
  );
};

export default PostsActions;
