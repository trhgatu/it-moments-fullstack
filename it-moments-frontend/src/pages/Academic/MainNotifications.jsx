import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spin, Input, Button, Dropdown, Menu } from "antd";
import { SearchOutlined, DownOutlined, LoadingOutlined } from "@ant-design/icons";
import Pagination from "../Posts/Pagination";

const MainNotifications = ({
  posts,
  category,
  currentPage,
  totalPages,
  onPageChange,
  keyword,
  setKeyword,
  handleSearch,
  onSortChange,
  fetchPosts,
  searchLoading,
}) => {
  const navigate = useNavigate();
  const [selectedSort, setSelectedSort] = useState("all");
  const [loading, setLoading] = useState(false);

  const handleSortChange = async (key) => {
    setSelectedSort(key);
    setLoading(true);
    await fetchPosts(key, currentPage);
    setLoading(false);
  };

  const handleNotificationClick = (slug) => {
    navigate(`/posts/${category}/${slug}`);
  };
  const sortLabels = {
    all: "Tất cả",
    newest: "Mới nhất",
    oldest: "Cũ nhất",
  };

  const sortMenu = (
    <Menu>
      <Menu.Item key="all" onClick={() => handleSortChange("all")}>
        Tất cả
      </Menu.Item>
      <Menu.Item key="newest" onClick={() => handleSortChange("newest")}>
        Mới nhất
      </Menu.Item>
      <Menu.Item key="oldest" onClick={() => handleSortChange("oldest")}>
        Cũ nhất
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="flex flex-col space-y-8 p-6 bg-gray-100 mb-36">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Input
            placeholder="Tìm kiếm bài viết..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={handleSearch}
            className="w-80 md:w-96 lg:w-[400px] h-10"
            style={{ height: "40px" }}
          />
          <Button
            className="ml-2"
            type="primary"
            onClick={handleSearch}
            style={{
              height: "40px",
              width: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            icon={
              searchLoading ? (
                <Spin
                  indicator={
                    <LoadingOutlined style={{ fontSize: "20px", color: "white" }} />
                  }
                />
              ) : (
                <SearchOutlined style={{ fontSize: "20px" }} />
              )
            }
          />
        </div>
        <Dropdown overlay={sortMenu} trigger={["click"]}>
          <Button className="flex items-center">
            Sắp xếp theo: <span className="ml-2 font-semibold">{sortLabels[selectedSort]}</span>{" "}
            <DownOutlined />
          </Button>
        </Dropdown>
      </div>



      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      ) : posts.length > 0 ? (
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
              <p className="line-clamp-2 mb-4">
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
