import React from 'react';
import { FaCalendarAlt } from 'react-icons/fa';

const events = [
  { date: '26', month: 'Tháng 10', title: 'Tổ chức Vòng Bán kết 3 - Fashion show' },
  { date: '25', month: 'Tháng 10', title: 'Định hướng phát triển quận Tân Phú đến năm 2030' },
  { date: '06', month: 'Tháng 10', title: 'Vòng sơ khảo cuộc thi Đại sứ Truyền thông' },
];

const UpcomingEvents = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      {/* Tiêu đề với biểu tượng lịch và đường kẻ dưới màu xanh lam */}
      <div className="flex items-center mb-6">
        <FaCalendarAlt className="text-blue-500 text-xl mr-2" />
        <h2 className="font-bold text-lg text-navy-800 border-b-2 pb-2 flex-1" 
            style={{ borderBottom: '2px solid', borderImage: 'linear-gradient(to right, #3b82f6, #93c5fd) 1' }}>
          SỰ KIỆN SẮP DIỄN RA
        </h2>
      </div>

      {/* Danh sách sự kiện */}
      <ul className="space-y-6 text-gray-700">
        {events.map((event, index) => (
          <li 
            key={index} 
            className="flex items-center p-4 rounded-lg hover:bg-gray-100 transition-all duration-200 space-x-4"
            style={{ minHeight: '80px' }}
          >
            {/* Vòng tròn chứa ngày tháng với gradient và bóng đổ */}
            <div className="flex flex-col items-center justify-center w-14 h-14 rounded-full bg-gradient-to-b from-blue-200 to-white shadow-md hover:bg-blue-300 transition-all duration-200">
              <span className="text-2xl font-bold text-blue-800">{event.date}</span>
              <span className="text-xs text-blue-400">{event.month}</span>
            </div>

            {/* Biểu tượng lịch và tiêu đề sự kiện */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center text-blue-700">
                <FaCalendarAlt className="mr-2 text-gray-400 text-sm" />
                <span className="text-sm font-semibold">{event.title}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpcomingEvents;
