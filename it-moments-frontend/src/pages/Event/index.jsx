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
    const [cachedPosts, setCachedPosts] = useState({});

    useEffect(() => {
        const fetchPosts = async () => {
            if (cachedPosts[category]) {
                setPosts(cachedPosts[category]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const response = await axios.get(`${API_URL}/posts?category=su-kien`);
                setPosts(response.data.data.posts);
                setCachedPosts((prev) => ({ ...prev, [category]: response.data.data.posts }));
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [category, cachedPosts]);

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
                <EventList posts={posts} category={category} />
            ) : (
                <Outlet />
            )}
        </div>
    );
}
