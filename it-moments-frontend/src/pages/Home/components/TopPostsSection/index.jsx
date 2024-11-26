import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../Home.module.scss';
import axios from 'axios';
import { EyeOutlined } from '@ant-design/icons';
import { API_URL } from '../../../../config/config';

export default function TopPostsSection() {
    const [topPosts, setTopPosts] = useState([]);
    const [topVotesPosts, setTopVotesPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const [viewsResponse, votesResponse] = await Promise.all([
                    axios.get(`${API_URL}/posts?category=van-nghe&sortKey=views&sortValue=desc&limit=6`),
                    axios.get(`${API_URL}/posts?category=van-nghe&sortKey=votes&sortValue=desc&limit=2`),
                ]);

                const viewsData = viewsResponse.data;
                const votesData = votesResponse.data;
                if(viewsData.success && votesData.success) {
                    setTopPosts(viewsData.data.posts);
                    setTopVotesPosts(votesData.data.posts);
                } else {
                    throw new Error('Failed to fetch posts data');
                }
            } catch(error) {
                setError(error.message || 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if(isLoading) {
        return <div>Loading...</div>;
    }

    if(error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="my-24">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="col-span-8">
                    <h2 className={`${styles.titleHeading} flex items-center text-4xl font-bold text-left mb-10`}>
                        <span className="border-l-4 border-blue-500 h-8 mr-4 inline-block"></span>
                        Nhiều lượt xem
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {topPosts.map((post) => (
                            <div
                                key={post._id}
                                className="border rounded flex flex-col h-full cursor-pointer"
                            >
                                <Link
                                    to={`/posts/${post.post_category_id.slug}/${post.slug}`}
                                    className="relative group overflow-hidden block h-full"
                                >
                                    <img
                                        src={post.thumbnail}
                                        alt={post.title}
                                        className="w-full h-48 object-cover rounded-t transform group-hover:scale-110 group-hover:brightness-75 transition-all duration-300"
                                    />
                                    <div className="p-4 flex flex-col justify-between flex-1 group">
                                        <h3 className="text-lg font-semibold text-blue-700 hover:text-blue-500 transition-all duration-300">
                                            {post.title}
                                        </h3>
                                        <div className='line-clamp-2 text-gray-600'
                                            dangerouslySetInnerHTML={{
                                                __html: post.description,
                                            }}
                                        />
                                        <div className="flex justify-between text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <EyeOutlined />
                                                <span className="ml-2">{post.views}</span>
                                            </div>
                                            <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-span-4">
                    <h2 className={`${styles.titleHeading} flex items-center text-4xl font-bold text-left mb-10`}>
                        <span className="border-l-4 border-blue-500 h-8 mr-4 inline-block"></span>
                        Nhiều lượt bình chọn
                    </h2>
                    <div className="space-y-8">
                        {topVotesPosts.map((post) => (
                            <div
                                key={post._id}
                                className="p-4 border rounded flex flex-col h-full"
                            >
                                <Link
                                    to={`/posts/${post.post_category_id.slug}/${post.slug}`}
                                    className="relative group overflow-hidden block h-full"
                                >
                                    <img
                                        src={post.thumbnail}
                                        alt={post.title}
                                        className="w-full h-32 object-cover rounded mb-3 transform group-hover:scale-110 group-hover:brightness-75 transition-all duration-300"
                                    />
                                    <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                                    <p className="text-gray-600 truncate mb-4">{post.description}</p>
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>{post.views} lượt xem</span>
                                        <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
