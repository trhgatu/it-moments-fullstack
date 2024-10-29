import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Outlet, useParams } from 'react-router-dom';
import ActivityList from './ActivityList';
import EventList from '../Event/EventList';
import Spinner from '../../components/Spinner'; // Import spinner

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
                const response = await axios.get(`http://localhost:3000/api/v1/posts?category=${category}`);
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
        return <Spinner />;
    }

    const RenderList = category === 'su-kien' ? EventList : ActivityList;

    return (
        <div>
            {!slug ? (
                <RenderList posts={posts} category={category} />
            ) : (
                <Outlet /> // Nếu có slug, chỉ hiển thị PostDetail
            )}
        </div>
    );
}
