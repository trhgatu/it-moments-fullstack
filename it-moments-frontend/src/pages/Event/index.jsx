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
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        pageSize: 6,
    });

    const fetchPosts = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${API_URL}/posts?category=${category}&page=${page}&limit=${pagination.pageSize}`
            );
            const data = response.data.data;
            setPosts(data.posts);
            setPagination((prev) => ({
                ...prev,
                currentPage: data.pagination.currentPage,
                totalPages: data.pagination.totalPage,
            }));
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts(pagination.currentPage);
    }, [category, pagination.currentPage]);

    const handlePageChange = (page) => {
        setPagination((prev) => ({ ...prev, currentPage: page }));
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f2f2f2',
            }}>
                <Spin size="large" tip="Loading data..." />
            </div>
        );
    }

    return (
        <div>
            {!slug ? (
                <EventList
                    posts={posts}
                    category={category}
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                />
            ) : (
                <Outlet />
            )}
        </div>
    );
}
