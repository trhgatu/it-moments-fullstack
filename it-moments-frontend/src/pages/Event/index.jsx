import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Outlet, useParams, Link } from 'react-router-dom';
import { Spin } from 'antd';
import { API_URL } from '../../config/config';
import EventList from './EventList';
import { IoIosArrowForward } from "react-icons/io";
export default function Event() {
    const { category = "su-kien", slug } = useParams();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("all"); // all, ongoing, upcoming, completed
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        pageSize: 6,
    });

    const fetchPosts = async (type = "all", page = 1) => {
        setLoading(true);
        try {
            // Điều chỉnh logic lấy dữ liệu
            let eventStatus = '';
            if(type === "ongoing") {
                eventStatus = "active"; // Sự kiện đang diễn ra
            } else if(type === "completed") {
                eventStatus = "completed"; // Sự kiện đã kết thúc
            }

            const response = await axios.get(
                `${API_URL}/posts?category=${category}&eventStatus=${eventStatus}&page=${page}&limit=${pagination.pageSize}`
            );
            const data = response.data.data;
            setPosts(data.posts);

            setPagination((prev) => ({
                ...prev,
                currentPage: data.pagination.currentPage,
                totalPages: data.pagination.totalPage,
            }));
        } catch(error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts(selectedCategory, pagination.currentPage);
    }, [selectedCategory, pagination.currentPage]);

    const handleCategoryChange = (type) => {
        setSelectedCategory(type); // Cập nhật selectedCategory
        setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset trang về 1
    };

    if(loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <Spin size="large" tip="Loading data..." />
            </div>
        );
    }

    return (
        <div className='pt-36 mx-auto pb-36'>
            {!slug ? (
                <div className="container mx-auto px-6 gap-8">
                    <div className="col-span-12 md:col-span-8 bg-white p-6 rounded-lg ">
                        <div className="bg-gray-200 p-4 flex items-center mb-8">
                            <Link
                                to="/"
                                className=" font-semibold hover:text-blue-600 transition duration-300"
                            >
                                <span>Trang chủ</span>
                            </Link>
                            <IoIosArrowForward />
                            <span
                                to="/posts/van-nghe"
                                className="font-semibold text-blue-500"
                            >
                                <span>Sự kiện</span>
                            </span>
                        </div>
                        <EventList
                            posts={posts}
                            category={category}
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={(page) => setPagination((prev) => ({ ...prev, currentPage: page }))}
                            onCategoryChange={handleCategoryChange}
                        />
                    </div>
                </div>
            ) : (
                <Outlet />
            )}
        </div>
    );
}
