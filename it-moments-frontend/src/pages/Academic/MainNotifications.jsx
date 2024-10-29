import React from 'react';
import { FaBookOpen, FaArrowRight } from 'react-icons/fa';
import slider1 from '../../assets/images/slider_1.jpg';
import slider2 from '../../assets/images/slider_2.jpg';
import slider3 from '../../assets/images/slider_3.jpg';

const notifications = [
  { 
    title: 'Hội thảo khoa học Khoa CNTT 2024', 
    date: '22/05/2024', 
    img: slider1, 
    description: 'Hội thảo về khoa học dữ liệu và chuyển đổi số trong giáo dục.'
  },
  { 
    title: 'Kỷ yếu Hội thảo khoa CNTT 2024', 
    date: '19/05/2024', 
    img: slider2,
    description: 'Tổng hợp những nghiên cứu tiêu biểu của sinh viên khoa CNTT.'
  },
  { 
    title: 'Thông báo số 6 - Tìm kiếm ý tưởng khởi nghiệp', 
    date: '27/04/2024', 
    img: slider3,
    description: 'Cơ hội khởi nghiệp cho sinh viên với các ý tưởng sáng tạo.'
  },
];

const MainNotifications = () => {
  return (
    <div className="flex flex-col space-y-8 p-6">
      <h2 className="font-bold text-2xl mb-6 text-navy-800 border-b-2 pb-2" 
          style={{ borderImage: 'linear-gradient(to right, #1e3a8a, #3b82f6) 1' }}>
        Nghiên Cứu - Học Thuật
      </h2>

      {notifications.map((notif, index) => (
        <div 
          key={index} 
          className="flex items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 space-x-6 relative"
          style={{ height: '180px' }}
        >
          {/* Vòng tròn ngày tháng chồng lên góc trái hình ảnh */}
          <div className="absolute -top-2 -left-2 w-14 h-14 bg-gradient-to-b from-blue-300 to-blue-600 rounded-full shadow-md flex items-center justify-center text-white font-bold text-sm">
            <span className="text-lg">{notif.date.split('/')[0]}</span>
            <span className="text-xs">{notif.date.split('/')[1]}</span>
          </div>

          {/* Hình ảnh sự kiện với viền mỏng */}
          <img 
            src={notif.img} 
            alt={notif.title} 
            className="w-40 h-40 object-cover rounded-lg border border-gray-200"
          />

          {/* Nội dung thông báo */}
          <div className="flex-1 space-y-2 ml-4">
            <h3 className="text-xl font-semibold text-gray-900">{notif.title}</h3>
            <div className="flex items-center text-gray-600 text-sm italic">
              <FaBookOpen className="mr-2 text-gray-600" />
              <p>{notif.description}</p>
            </div>
            <p className="text-xs text-gray-400">{notif.date}</p>
          </div>
        </div>
      ))}

      <div className="text-right mt-6">
        <a 
          href="#" 
          className="inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-semibold text-base transition-all duration-200 shadow-md"
          style={{
            background: 'linear-gradient(to right, #1e3a8a, #3b82f6)',
            color: 'white',
          }}
        >
          <span>Xem thêm</span>
          <FaArrowRight className="text-base" />
        </a>
      </div>
    </div>
  );
};

export default MainNotifications;
