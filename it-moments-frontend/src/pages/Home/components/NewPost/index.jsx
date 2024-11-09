import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { API_URL } from '../../../../config/config';

export default function NewPost() {
    const [latestPost, setLatestPost] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const latestResponse = await axios.get(`${API_URL}/posts/lastestPost/?category=van-nghe`);
                setLatestPost(latestResponse.data.data.post)
            } catch(error) {
                console.error('Lỗi khi lấy bài viết:', error);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div className="relative block md:col-span-2 h-full min-h-[400px]">
            {latestPost && (
                <div
                    className="relative overflow-hidden h-full flex flex-col justify-end p-8 bg-cover bg-center text-white"
                    style={{ backgroundImage: `url(${latestPost.thumbnail})` }}
                >
                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>

                    <div className="relative z-10">
                        <div className="text-lg md:text-3xl font-semibold mt-2">
                            <Link to={`/posts/${latestPost.post_category_id.slug}`} className="text-white font-semibold hover:text-blue-500 transition">
                                <span className="bg-blue-500 px-2 py-1">
                                    {latestPost.post_category_id.title}
                                </span>
                            </Link>
                            <span className="mx-2">/</span> {/* Khoảng cách giữa link và dấu '/' */}
                            <span className="ml-2">{new Date(latestPost.createdAt).toLocaleDateString()}</span> {/* Ngày không bị ảnh hưởng bởi hover */}
                        </div>

                        <h2 className="text-lg md:text-3xl font-semibold mt-2 hover:text-blue-500 transition">
                            <Link to={`/posts/${latestPost.post_category_id.slug}/${latestPost.slug}`}>{latestPost.title}</Link>
                        </h2>
                        <p className="text-sm md:text-lg mt-2">{latestPost.description.slice(0, 100)}...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
