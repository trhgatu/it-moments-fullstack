import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../Home.module.scss';
import axios from 'axios';

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
                    axios.get(`${API_URL}/posts?category=van-nghe&sortKey=views&sortValue=desc`),
                    axios.get(`${API_URL}/posts?category=van-nghe&sortKey=votes&sortValue=desc`),
                ]);

                const viewsData = viewsResponse.data;
                const votesData = votesResponse.data;
                if (viewsData.success && votesData.success) {
                    setTopPosts(viewsData.data.posts);
                    setTopVotesPosts(votesData.data.posts);
                } else {
                    throw new Error("Failed to fetch posts data");
                }
            } catch (error) {
                setError(error.message || "An error occurred");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="my-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="col-span-8">
                    <h2 className={`${styles.titleHeading} flex items-center text-4xl font-bold text-left`}>
                        <span className="border-l-4 border-blue-500 h-8 mr-4 inline-block"></span>
                        Nhiều lượt xem
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {topPosts.map((post) => (
                            <div
                                key={post._id}
                                className="relative h-96 rounded overflow-hidden shadow-lg"
                                style={{
                                    backgroundImage: `url(${post.thumbnail})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            >
                                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h3 className="text-lg font-semibold">{post.title}</h3>
                                    <p className="text-sm truncate">{post.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-span-4">
                    <h2 className={`${styles.titleHeading} flex items-center text-4xl font-bold text-left`}>
                        <span className="border-l-4 border-blue-500 h-8 mr-4 inline-block"></span>
                        Nhiều lượt bình chọn
                    </h2>
                    <div className="space-y-4">
                        {topVotesPosts.map((post) => (
                            <div key={post._id} className="p-4 border rounded shadow-lg">
                                <img
                                    src={post.thumbnail}
                                    alt={post.title}
                                    className="w-full h-32 object-cover rounded mb-3"
                                />
                                <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                                <p className="text-sm text-gray-600 truncate">{post.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="text-center mt-6">
                <Link
                    to="/van-nghe"
                    className="inline-block px-6 py-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
                >
                    Xem tất cả
                </Link>
            </div>
        </div>
    );
}
