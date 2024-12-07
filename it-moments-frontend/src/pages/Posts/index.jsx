import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useSearchParams, useNavigate, Outlet } from 'react-router-dom';
import { API_URL } from '../../config/config';
import ActivityList from './ActivityList';

export default function Posts() {
    const { category, slug } = useParams();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cachedPosts, setCachedPosts] = useState({});

    const [totalPages, setTotalPages] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const pageFromUrl = parseInt(searchParams.get('page')) || 1;
    const [currentPage, setCurrentPage] = useState(pageFromUrl);
    useEffect(() => {
        setCurrentPage(pageFromUrl);
    }, [pageFromUrl]);
    useEffect(() => {
        setPosts([]);
        setCurrentPage(1);
        setCachedPosts((prev) => ({
            ...prev,
            [category]: {},
        }));
    }, [category]);

    useEffect(() => {
        const fetchPosts = async () => {
            if(cachedPosts[category] && cachedPosts[category][currentPage]) {
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
                const pagination = response.data.data.pagination;
                const posts = response.data.data.posts || [];
                const totalPages = pagination.totalPage;
                setPosts(posts);
                setTotalPages(totalPages);

                setCachedPosts((prev) => ({
                    ...prev,
                    [category]: {
                        ...prev[category],
                        [currentPage]: posts,
                    },
                }));
            } catch(error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [category, currentPage, cachedPosts]);

    const handlePageChange = (page) => {
        if(page !== currentPage) {
            setCurrentPage(page);
            navigate(`/posts/${category}?page=${page}`);
        }
    };


    return (
        <>
            {!slug ? (
                <ActivityList
                    posts={posts}
                    category={category}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    currentPage={currentPage}
                    loading={loading}
                />
            ) : (
                <Outlet />
            )}
        </>
    );
}
