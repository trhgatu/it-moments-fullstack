import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import Pagination from "../Posts/Pagination";

const MainNotifications = ({ posts, category, currentPage, totalPages, onPageChange }) => {
  const navigate = useNavigate();

  const handleNotificationClick = (slug) => {
    navigate(`/posts/${category}/${slug}`);
  };

  return (
    <div className="flex flex-col space-y-8 p-6 bg-gray-100 mb-36">
      {posts.length > 0 ? (
        posts.map((post, index) => (
          <div
            key={index}
            onClick={() => handleNotificationClick(post.slug)}
            className="flex bg-white rounded-lg overflow-hidden transition-all duration-300 ease-in-out cursor-pointer hover:bg-gray-200 group"
          >
            <div className="relative w-1/3 h-72">
              <img
                src={post.thumbnail || "https://via.placeholder.com/300"}
                alt={post.title}
                className="w-full h-full object-cover rounded-lg shadow-md"
              />
              <div className="absolute top-0 right-0 bg-white text-center p-3 rounded-bl-lg shadow-lg">
                <div className="text-lg font-semibold text-gray-800 uppercase">
                  {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>
            <div className="w-2/3 px-6 py-4 flex flex-col justify-center">
              <h3 className="text-2xl font-extrabold text-gray-900 mb-2 flex items-center">
                <span className="transition-colors duration-200 group-hover:text-blue-500 line-clamp-2">
                  {post.title}
                </span>
              </h3>
              <p className=" line-clamp-2 mb-4">
                <span
                  dangerouslySetInnerHTML={{
                    __html: post.description,
                  }}
                />
              </p>
              <a
                href="#"
                className="text-blue-500 text-sm font-semibold hover:underline mt-4"
              >
                Đọc thêm →
              </a>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500">Không có thông báo nào.</div>
      )}
      <div className="flex justify-center mt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default MainNotifications;
