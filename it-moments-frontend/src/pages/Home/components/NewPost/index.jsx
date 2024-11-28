import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { API_URL } from '../../../../config/config';
import { EyeOutlined } from '@ant-design/icons';
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
        <div className="relative block md:col-span-2 min-h-48 h-full">
            {latestPost && (
                <div
                    className="relative overflow-hidden h-full flex flex-col justify-end p-8 bg-cover bg-center text-white"
                    style={{ backgroundImage: `url(${latestPost.thumbnail})` }}
                >
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>

                    {/* Badge - Góc trái trên */}
                    <div className="absolute top-4 left-4 bg-blue-500 text-white px-2 py-1 rounded">
                        <Link to={`/posts/${latestPost.post_category_id.slug}`} className="text-white font-semibold hover:text-blue-500 transition">
                            {latestPost.post_category_id.title}
                        </Link>
                    </div>

                    <div className="relative z-10 mt-12">
                        <h2 className="text-4xl md:text-3xl font-semibold mt-2 hover:text-blue-500 transition">
                            <Link to={`/posts/${latestPost.post_category_id.slug}/${latestPost.slug}`}>{latestPost.title}</Link>
                        </h2>
                        <div className='line-clamp-2'
                            dangerouslySetInnerHTML={{
                                __html: latestPost.description,
                            }}
                        />
                    </div>
                    <div className="flex justify-between text-sm text-gray-200 mt-4">
                        <div className='flex items-center text-white'>
                            <EyeOutlined className='text-lg' />
                            <span className='text-lg ml-2'>
                                {latestPost.views}
                            </span>
                        </div>
                        <span>{new Date(latestPost.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
