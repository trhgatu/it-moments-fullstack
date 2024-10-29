import React from 'react';

const Breadcrumbs = () => {
  return (
    <div className="flex justify-between items-center bg-gray-200 p-4 rounded-lg shadow-sm">
      <div className="text-sm text-gray-600">
        <a href="/" className="hover:text-blue-500">Trang chủ</a> / <span className="text-gray-800">Nghiên cứu - Học thuật</span>
      </div>
      <div className="text-sm text-gray-600">Thứ hai, ngày 28/10/2024 02:30:23 GMT+7</div>
    </div>
  );
};

export default Breadcrumbs;
