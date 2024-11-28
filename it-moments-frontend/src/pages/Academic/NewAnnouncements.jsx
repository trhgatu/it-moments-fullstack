import React from "react";
import { FaBell, FaCalendarAlt } from "react-icons/fa";

const announcements = [
  {
    title: "Danh sách sinh viên đăng ký thực tập",
    description: "Kiểm tra danh sách sinh viên đăng ký thực tập kỳ này...",
    date: "25/11/2024",
    icon: <FaBell className="text-white text-lg" />,
  },
  {
    title: "Thông báo thời gian tổ chức thi cuối kỳ",
    description: "Thông báo chính thức về thời gian thi cuối kỳ học kỳ 2...",
    date: "24/11/2024",
    icon: <FaCalendarAlt className="text-white text-lg" />,
  },
  {
    title: "Biểu mẫu báo cáo thực tập tốt nghiệp",
    description: "Tải xuống biểu mẫu mới nhất cho báo cáo thực tập...",
    date: "23/11/2024",
    icon: <FaBell className="text-white text-lg" />,
  },
];

const NewAnnouncements = () => {
  return (
    <>
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-400 to-blue-600 px-4 py-3 rounded-t-lg  transition-shadow duration-200">
        <div className="flex items-center space-x-2">
          <FaBell className="text-white text-2xl" />
          <span className=" font-semibold text-white">Thông báo mới</span>
        </div>
      </div>
      <ul className="space-y-6 mt-4">
        {announcements.map((announcement, index) => (
          <li
            key={index}
            className="flex items-start p-4 bg-white rounded-lg cursor-pointer transform hover:scale-105 hover:bg-gray-200 duration-300 transition-all border-l-4 border-blue-500"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
              {announcement.icon}
            </div>

            <div className="ml-4 flex-1">
              <h3 className="text-md font-bold text-gray-800">{announcement.title}</h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {announcement.description}
              </p>
              <span className="text-xs text-gray-400 mt-2 inline-block italic">
                {announcement.date}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6 text-center">
        <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-transform flex items-center justify-center">
          Xem thêm
        </button>
      </div>
    </>
  );
};

export default NewAnnouncements;
