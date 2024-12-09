import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Outlet, useParams, Link } from 'react-router-dom';
import { Spin } from 'antd';
import { IoIosArrowForward } from "react-icons/io";
import { API_URL } from '../../config/config';
import MainNotifications from './MainNotifications';
import NewAnnouncements from './NewAnnouncements';

export default function Academic() {
  const { category = "hoc-thuat", slug } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 3,
  });
  const [keyword, setKeyword] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const fetchPosts = async (sortType = "all", page = 1) => {
    setLoading(true);
    try {
      let sortKey = "";
      let sortValue = "";

      switch(sortType) {
        case "newest":
          sortKey = "createdAt";
          sortValue = "desc";
          break;
        case "oldest":
          sortKey = "createdAt";
          sortValue = "asc";
          break;
        default:
          break;
      }

      const response = await axios.get(
        `${API_URL}/posts?category=${category}&sortKey=${sortKey}&sortValue=${sortValue}&page=${page}&limit=${pagination.pageSize}&keyword=${keyword}`
      );
      const data = response.data.data;
      setPosts(data.posts);

      setPagination((prev) => ({
        ...prev,
        currentPage: data.pagination.currentPage,
        totalPages: data.pagination.totalPage,
      }));
    } catch(error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const handleSortChange = (sortType) => {
    fetchPosts(sortType, pagination.currentPage);
  };

  const handleSearch = () => {
    setLoading(true);
    fetchPosts(selectedCategory, pagination.currentPage, keyword);
    setSearchLoading(true);
  };
  useEffect(() => {
    fetchPosts(selectedCategory, pagination.currentPage);
  }, [selectedCategory, pagination.currentPage]);

  const handleCategoryChange = (type) => {
    setSelectedCategory(type);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };



  return (
    <>
      {!slug ? (
        <div className="container mx-auto px-6 grid grid-cols-12 gap-8 pt-36">
          <div className="col-span-12 md:col-span-8 bg-white p-6 rounded-lg">
            <div className=" p-4 flex items-center mb-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg">
              <Link to="/" className="font-semibold hover:text-white transition duration-300">
                <span>Trang chủ</span>
              </Link>
              <IoIosArrowForward />
              <span className="font-semibold text-white">Học thuật</span>
            </div>
            <MainNotifications
              posts={posts}
              category={category}
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={(page) => setPagination((prev) => ({ ...prev, currentPage: page }))}
              keyword={keyword}
              setKeyword={setKeyword}
              handleSearch={handleSearch}
              searchLoading={searchLoading}
              onSortChange={handleSortChange}
              fetchPosts={fetchPosts}
            />

          </div>
          <div className="col-span-12 md:col-span-4 space-y-8">
            <div className="bg-white rounded-lg shadow-lg">
              <NewAnnouncements
                posts={posts}
                category={category} />
            </div>
          </div>
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
}
