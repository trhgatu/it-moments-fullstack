import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Outlet, useParams } from 'react-router-dom';
import { Spin } from 'antd';
import { API_URL } from '../../config/config';
import EventList from './EventList';

export default function Event() {
    const { category = "su-kien", slug } = useParams();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("all"); // all, ongoing, upcoming
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        pageSize: 6,
    });
    const fetchPosts = async (type = "all", page = 1) => {
        setLoading(true);
        try {
            // Nếu selectedCategory là 'ongoing', truyền eventStatus=active vào query
            const eventStatus = type === "ongoing" ? "active" : "";
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
        <>
            {!slug ? (
                <EventList
                    posts={posts}
                    category={category}
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={(page) => setPagination((prev) => ({ ...prev, currentPage: page }))}
                    onCategoryChange={handleCategoryChange} // Pass handler
                />
            ) : (
                <Outlet />
            )}
        </>
    );
}
