import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import {API_URL} from '../../../../config/config'
export default function NewPost() {
    const [latestPosts, setLatestPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const latestResponse = await axios.get(`${API_URL}/posts?category=van-nghe&isLastest=true&limit=1&sort=createdAt&order=desc`);
                setLatestPosts(latestResponse.data.data.posts);
            } catch(error) {
                console.error('Lỗi khi lấy bài viết:', error);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div className="relative block md:col-span-2 h-full min-h-[400px]">
            {latestPosts.length > 0 && latestPosts.map((post, index) => (
                <div
                    key={index}
                    className="relative overflow-hidden h-full flex flex-col justify-end p-8 bg-cover bg-center text-white"
                    style={{ backgroundImage: `url(${post.thumbnail})` }} // Duy trì chiều cao từ CSS
                >

                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>

                    <div className="relative z-10">
                        <div className="text-lg md:text-3xl font-semibold mt-2 hover:text-blue-500 transition">
                            <Link to={`/category/${post.post_category_id.slug}`} className="text-white font-semibold">
                                <span className="bg-blue-500 px-2 py-1">
                                    {post.post_category_id.title}
                                </span>
                            </Link>
                            <span>/</span>
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h2 className="text-lg md:text-3xl font-semibold mt-2 hover:text-blue-500 transition">
                            <Link to={`/posts/${post.post_category_id.slug}/${post.slug}`}>{post.title}</Link>
                        </h2>
                        <p className="text-sm md:text-lg mt-2">{post.description.slice(0, 100)}...</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
