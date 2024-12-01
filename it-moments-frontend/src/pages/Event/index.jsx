import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Outlet, useParams, Link } from 'react-router-dom';
import { Spin } from 'antd';
import { API_URL } from '../../config/config';
import EventList from './EventList';

export default function Event() {
    const { category = "su-kien", slug } = useParams();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        pageSize: 6,
    });

    const fetchPosts = async (type = "all", page = 1) => {
        setLoading(true);
        try {
            let eventStatus = '';
            if(type === "ongoing") {
                eventStatus = "active";
            } else if(type === "completed") {
                eventStatus = "completed";
            } else if(type === "pending") {
                eventStatus = "pending"
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
        setSelectedCategory(type);
        setPagination((prev) => ({ ...prev, currentPage: 1 }));
    };

    if(loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <Spin size="large" tip="Loading data..." />
            </div>
        );
    }

    return (
        <div className='pt-36 pb-36'>
            {!slug ? (
                <div className="container mx-auto px-6 gap-8 grid grid-cols-12">
                    <EventList
                        posts={posts}
                        category={category}
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={(page) => setPagination((prev) => ({ ...prev, currentPage: page }))}
                        onCategoryChange={handleCategoryChange}
                    />
                </div>
            ) : (
                <Outlet />
            )}
        </div>
    );
}
