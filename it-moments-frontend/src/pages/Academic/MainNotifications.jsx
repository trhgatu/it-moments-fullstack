import React from 'react';
import { FaBookOpen, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MainNotifications = ({ posts = [], category }) => {
  const navigate = useNavigate();

  const handleNotificationClick = (slug) => {
    navigate(`/posts/${category}/${slug}`);
  };

  return (
    <div className="flex flex-col space-y-8 p-6">
      <h2
        className="font-bold text-2xl mb-6 text-navy-800 border-b-2 pb-2"
        style={{ borderImage: 'linear-gradient(to right, #1e3a8a, #3b82f6) 1' }}
      >
        Nghiên Cứu - Học Thuật
      </h2>

      {posts.length > 0 ? (
        posts.map((post, index) => (
          <div
            key={index}
            onClick={() => handleNotificationClick(post.slug)} // Use the passed category
            className="flex items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 space-x-6 relative cursor-pointer"
            style={{ height: '180px' }}
          >
            <div className="absolute -top-2 -left-2 w-14 h-14 bg-gradient-to-b from-blue-300 to-blue-600 rounded-full shadow-md flex items-center justify-center text-white font-bold text-sm">
              <span className="text-lg">{new Date(post.createdAt).getDate()}</span>
              <span className="text-xs">{new Date(post.createdAt).toLocaleDateString('vi-VN', { month: 'short' })}</span>
            </div>

            {/* Hình ảnh sự kiện */}
            <img
              src={post.thumbnail || 'https://via.placeholder.com/150'}
              alt={post.title}
              className="w-40 h-40 object-cover rounded-lg border border-gray-200"
            />
            <div className="flex-1 space-y-2 ml-4">
              <h3 className="text-xl font-semibold text-gray-900">{post.title}</h3>
              <div className="flex items-center text-gray-600 text-sm italic">
                <FaBookOpen className="mr-2 text-gray-600" />
                <div className="line-clamp-2" dangerouslySetInnerHTML={{ __html: post.description }} />
              </div>
              <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString('vi-VN')}</p>
            </div>
          </div>
        ))
      ) : (
        <div>Không có thông báo nào.</div>
      )}

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
