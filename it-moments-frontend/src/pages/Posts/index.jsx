import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useSearchParams, Outlet } from 'react-router-dom';
import { Spin } from 'antd';
import { API_URL } from '../../config/config';
import ActivityList from './ActivityList';

export default function Posts() {
    const { category, slug } = useParams();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cachedPosts, setCachedPosts] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const pageFromUrl = parseInt(searchParams.get('page')) || 1;
        setCurrentPage(pageFromUrl);
    }, [searchParams]);

    useEffect(() => {
        const fetchPosts = async () => {
            if (cachedPosts[category] && cachedPosts[category][currentPage]) {
                setPosts(cachedPosts[category][currentPage]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const response = await axios.get(`${API_URL}/posts`, {
                    params: {
                        category,
                        page: currentPage,
                        limit: 6,
                    },
                });

                const pagination = response.data.pagination || {};
                const posts = response.data.data.posts || [];
                const totalPages = pagination.totalPage || 1;

                setPosts(posts);
                setTotalPages(totalPages);
                setCachedPosts((prev) => ({
                    ...prev,
                    [category]: {
                        ...prev[category],
                        [currentPage]: posts,
                    },
                }));
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [category, currentPage, cachedPosts]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <Spin size="large" tip="Đang tải dữ liệu..." />
            </div>
        );
    }

    return (
        <div>
            {!slug ? (
                <ActivityList
                    posts={posts}
                    category={category}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    currentPage={currentPage}
                />
            ) : (
                <Outlet />
            )}
        </div>
    );
}
