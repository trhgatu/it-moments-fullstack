import React from 'react';
import { FaBell } from "react-icons/fa";
import { IoMdText } from "react-icons/io";
import { useNavigate } from "react-router-dom";
const NewAnnouncements = ({ posts, category }) => {
  const navigate = useNavigate();
  const sortedPosts = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const handleNotificationClick = (slug) => {
    navigate(`/posts/${category}/${slug}`);
  };
  return (
    <>
      <div className="flex items-center bg-gradient-to-r from-blue-400 to-blue-600 px-4 py-3 rounded-t-lg transition-shadow duration-200">
        <div className="flex items-center space-x-2">
          <FaBell className="text-white text-2xl" />
          <span className="font-semibold text-white text-center">Thông báo mới</span>
        </div>
      </div>

      <div className='pt-4'>
        <ul>
          {sortedPosts.map((announcement) => (
            <li
              key={announcement._id}
              onClick={() => handleNotificationClick(announcement.slug)}
              className="flex  items-center mb-[12px] p-4 bg-white cursor-pointer transform  hover:bg-gray-200 duration-300 transition-all border-l-4 border-blue-500"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                <IoMdText className="text-white text-lg" />
              </div>

              <div className="ml-4 flex-1">
                <h3 className="font-bold line-clamp-2">{announcement.title}</h3>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default NewAnnouncements;
