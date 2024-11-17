import React from 'react';
import styles from './Profile.module.scss';
import { useClientUser } from '../../context/ClientUserContext';

const Profile = () => {
  const { user } = useClientUser();

  const votedPosts = [
    { title: "Bài viết 1", date: "01/01/2024" },
    { title: "Bài viết 2", date: "02/01/2024" },
    { title: "Bài viết 3", date: "03/01/2024" },
  ];

  return (
    <div className="container mx-auto bg-white rounded-lg overflow-hidden">
      <div className={styles.mainContent}>
        <div className="relative">
          <img
            src="https://fullstack.edu.vn/assets/cover-profile-CDYcrPwJ.png"
            alt="Cover"
            className="w-full h-auto object-cover rounded-b-3xl"
          />
          {/* Căn chỉnh avatar và tên người dùng sang bên trái */}
          <div className="absolute -bottom-24 md:-bottom-32 left-10">
            <img
              src="https://files.fullstack.edu.vn/f8-prod/public-images/6679277183b87.png"
              alt="Avatar"
              className="w-40 h-40 md:w-60 md:h-60 rounded-full border-4 border-white ring-8 ring-white"
            />
          </div>
          <span className="pt-6 md:pt-8 absolute left-60 md:left-80 text-xl md:text-4xl font-bold text-gray-800">{user.fullName}</span>
        </div>

        {/* Layout grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-32 md:mt-48 px-4 md:px-10">
          <div className="shadow-[rgba(0,_0,_0,_0.02)_0px_1px_3px_0px,_rgba(27,_31,_35,_0.15)_0px_0px_0px_1px] p-6 bg-white rounded-lg col-span-1">
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-gray-800">Giới thiệu</h3>
              <p className="text-gray-600 mt-4">
                Tôi là một lập trình viên với kinh nghiệm làm việc trong các dự án phần mềm. Tôi đam mê công nghệ và luôn tìm kiếm cơ hội học hỏi và phát triển. Hiện tại, tôi đang làm việc tại một công ty phần mềm lớn.
              </p>
            </div>
          </div>

          <div className="shadow-[rgba(0,_0,_0,_0.02)_0px_1px_3px_0px,_rgba(27,_31,_35,_0.15)_0px_0px_0px_1px] p-6 bg-white rounded-lg col-span-1 md:col-span-2 lg:col-span-2">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800">Bài viết đã bình chọn</h3>
              <ul className="space-y-4 mt-4">
                {votedPosts.map((post, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span className="text-gray-600">{post.title}</span>
                    <span className="text-gray-500 text-sm">{post.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
