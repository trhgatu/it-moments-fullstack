import React from 'react';
import { FaBell, FaArrowRight } from 'react-icons/fa';

const announcements = [
  'Danh sách sinh viên đăng ký thực tập...',
  'Thông báo thời gian tổ chức thi cuối kỳ...',
  'Biểu mẫu báo cáo thực tập tốt nghiệp...',
];

const NewAnnouncements = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      {/* Tiêu đề với biểu tượng chuông và đường kẻ dưới màu xanh lam */}
      <div className="flex items-center mb-6">
        <FaBell className="text-blue-500 text-xl mr-2" />
        <h2 className="font-bold text-lg text-navy-800 border-b-2 pb-2 flex-1" 
            style={{ borderBottom: '2px solid', borderImage: 'linear-gradient(to right, #3b82f6, #93c5fd) 1' }}>
          THÔNG BÁO MỚI
        </h2>
      </div>

      {/* Danh sách thông báo */}
      <ul className="space-y-6 text-gray-800">
        {announcements.map((item, index) => (
          <li 
            key={index} 
            className="flex items-center p-4 rounded-lg hover:bg-gray-100 transition-all duration-200 space-x-4"
            style={{ minHeight: '70px' }}
          >
            {/* Biểu tượng chuông với vòng tròn nền mờ và đổ bóng */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 shadow-md transition-transform duration-200 hover:scale-110">
              <FaBell className="text-blue-600 text-lg" />
            </div>
            <span className="text-sm text-gray-700">{item}</span>
          </li>
        ))}
      </ul>

      {/* Nút "Xem thêm" với màu xanh lam và hiệu ứng hover */}
      <div className="text-right mt-6">
        <a 
          href="#" 
          className="inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-semibold text-base transition-all duration-200 border-2"
          style={{
            borderImage: 'linear-gradient(to right, #3b82f6, #93c5fd) 1',
            color: '#3b82f6',
            backgroundColor: '#E5F0FF',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#D1E9FF';
            e.currentTarget.style.color = '#2563eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#E5F0FF';
            e.currentTarget.style.color = '#3b82f6';
          }}
        >
          <span>Xem thêm</span>
          <FaArrowRight className="text-base" />
        </a>
      </div>
    </div>
  );
};

export default NewAnnouncements;
