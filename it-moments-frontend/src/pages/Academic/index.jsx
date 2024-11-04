import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Breadcrumbs from './Breadcrumbs';
import MainNotifications from './MainNotifications';
import NewAnnouncements from './NewAnnouncements';
import UpcomingEvents from './UpcomingEvents';
import { API_URL } from '../../config/config'; // Đường dẫn tới file config của bạn
import { Spin } from 'antd'; // Thư viện Ant Design cho loading

const Academic = () => {
  const [notifications, setNotifications] = useState([]); // State để lưu dữ liệu từ API
  const [loading, setLoading] = useState(true); // State để kiểm tra trạng thái loading

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${API_URL}/posts?category=hoc-thuat`); // Gọi API
        setNotifications(response.data.data.posts); // Lưu dữ liệu vào state
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false); // Đặt loading về false khi đã hoàn thành
      }
    };

    fetchNotifications(); // Gọi hàm fetch khi component được mount
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white to-gray-100 min-h-screen py-10">
      <div className="container mx-auto px-6 grid grid-cols-12 gap-8">

        {/* Breadcrumbs */}
        <div className="col-span-12 mb-6">
          <Breadcrumbs />
        </div>

        {/* Main Notifications Section */}
        <div className="col-span-12 md:col-span-8 bg-white p-6 rounded-lg shadow-lg">
          <MainNotifications notifications={notifications} /> {/* Truyền notifications vào MainNotifications */}
        </div>

        {/* Side Sections */}
        <div className="col-span-12 md:col-span-4 space-y-8">
          {/* New Announcements Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <NewAnnouncements />
          </div>

          {/* Upcoming Events Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <UpcomingEvents />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Academic;
