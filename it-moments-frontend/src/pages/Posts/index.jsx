import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Outlet, useParams } from 'react-router-dom';
import ActivityList from './ActivityList';
import Academic from '../Academic';
import EventList from '../Event/EventList';
import { Spin } from 'antd'; // Nhập component Spin từ Ant Design
import { API_URL } from '../../config/config';

export default function Posts() {
    const { category, slug } = useParams();
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
                const response = await axios.get(`${API_URL}/posts?category=${category}`);
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
                height: '100vh' // Chiều cao toàn bộ trang
            }}>
                <Spin size="large" tip="Đang tải dữ liệu..." />
            </div>
        );
    }


    let RenderList;
    if (category === 'su-kien') {
        RenderList = EventList;
    } else if (category === 'hoc-thuat') {
        RenderList = Academic;
    } else {
        RenderList = ActivityList;
    }

    return (
        <div>
            {!slug ? (
                <RenderList posts={posts} category={category} />
            ) : (
                <Outlet />
            )}
        </div>
    );
}
