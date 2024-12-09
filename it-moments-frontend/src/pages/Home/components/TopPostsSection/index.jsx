import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../Home.module.scss';
import axios from 'axios';
import { FaRegCalendarAlt } from "react-icons/fa";
import { EyeOutlined } from '@ant-design/icons';
import { API_URL } from '../../../../config/config';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Spin } from 'antd';

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
                    axios.get(`${API_URL}/posts?category=van-nghe&sortKey=views&sortValue=desc&limit=6&isFeatured=true`),
                    axios.get(`${API_URL}/posts?category=van-nghe&sortKey=votes&sortValue=desc&limit=2&isFeatured=true`),
                ]);

                const viewsData = viewsResponse.data;
                const votesData = votesResponse.data;
                if(viewsData.success && votesData.success) {
                    const filteredVotesPosts = votesData.data.posts.filter(post => post.votes > 0);
                    setTopPosts(viewsData.data.posts);
                    setTopVotesPosts(filteredVotesPosts);
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
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
        });
    }, []);

    if(isLoading) {
        return <div><Spin size='large' ></Spin></div>;
    }

    if(error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="my-24">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div
                    className="col-span-8"
                    data-aos="fade-right"
                >
                    <h2 className={`${styles.titleHeading} flex items-center text-4xl font-bold text-left mb-10`}>
                        <span className="border-l-4 border-blue-500 h-8 mr-4 inline-block"></span>
                        Nhiều lượt xem
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {topPosts.map((post) => (
                            <div
                                key={post._id}
                                className="border rounded flex flex-col h-full cursor-pointer overflow-hidden group"
                            >
                                <Link
                                    to={`/posts/${post.post_category_id.slug}/${post.slug}`}
                                    className="relative group block h-full"
                                    style={{
                                        backgroundImage: `url(${post.thumbnail})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        height: '250px',
                                    }}
                                >
                                    <div className="p-6 flex flex-col w-full justify-between flex-1 group bg-black bg-opacity-80 absolute bottom-0 transition-all duration-300">
                                        <h3 className="font-semibold text-white line-clamp-2 group-hover:text-blue-500 transition-all duration-300">
                                            {post.title}
                                        </h3>
                                        <div className="flex justify-between text-gray-300">
                                            <div className="flex items-center">
                                                <EyeOutlined />
                                                <span className="ml-2">{post.views}</span>
                                            </div>
                                            <span className='flex items-center'>
                                                <FaRegCalendarAlt />
                                                <span className='ml-2'>
                                                    {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 text-center">
                        <Link to="/posts/van-nghe?sortKey=views&sortValue=desc" className="text-blue-600 hover:text-blue-800 font-semibold">
                            Xem tất cả
                        </Link>
                    </div>
                </div>
                <div
                    className="col-span-4 pl-20"
                    data-aos="fade-up"
                >
                    <h2 className={`${styles.titleHeading} flex items-center text-4xl font-bold text-left mb-10`}>
                        <span className="border-l-4 border-blue-500 h-8 mr-4 inline-block"></span>
                        Nhiều lượt bình chọn
                    </h2>
                    <div className="space-y-10">
                        {topVotesPosts.map((post) => (
                            <div
                                key={post._id}
                                className=" border rounded flex flex-col h-full cursor-pointer overflow-hidden group"
                            >
                                <Link
                                    to={`/posts/${post.post_category_id.slug}/${post.slug}`}
                                    className="relative group block h-full"
                                    style={{
                                        backgroundImage: `url(${post.thumbnail})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        height: '250px',
                                    }}
                                >
                                    <div className="p-6 flex flex-col w-full justify-between flex-1 group bg-black bg-opacity-70 absolute bottom-0 transition-all duration-300">
                                        <h3 className="text-xl font-semibold line-clamp-2 text-white mb-2 group-hover:text-blue-500 transition-all duration-300">
                                            {post.title}
                                        </h3>
                                        <div className="flex justify-between text-white">
                                            <div className="flex items-center">
                                                <EyeOutlined />
                                                <span className="ml-2">{post.views}</span>
                                            </div>
                                            <span className='flex items-center'>
                                                <FaRegCalendarAlt />
                                                <span className='ml-2'>
                                                    {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                                                </span>
                                            </span>
                                        </div>
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
