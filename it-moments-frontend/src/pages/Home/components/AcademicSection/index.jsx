import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import backgroundImage from '../../../../assets/images/hoc-thuat.jpg';
import { API_URL } from '../../../../config/config';
import { EyeOutlined } from "@ant-design/icons";
import { FaRegClock } from "react-icons/fa";
import DOMPurify from 'dompurify';

const sanitizedDescription = (html) => DOMPurify.sanitize(html);

const AcademicSection = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await axios.get(`${API_URL}/posts?category=hoc-thuat`);
                if(response.data.success) {
                    setPosts(response.data.data.posts.slice(0, 4)); // Lấy 4 bài viết mới nhất
                } else {
                    throw new Error('Failed to fetch posts');
                }
            } catch(error) {
                setError(error.message || 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if(isLoading) {
        return <div>Loading...</div>;
    }

    if(error) {
        return <div>Error: {error}</div>;
    }

    return (
        <section>
            <div
                className="relative"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '300px',
                }}
            >
                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                    <h1 className="text-5xl font-bold text-white text-center">
                        Các hoạt động học thuật của khoa CNTT
                    </h1>
                </div>
            </div>
            <div className="container mx-auto mt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {posts.map((post) => (
                        <div
                            key={post._id}
                            className="border rounded-lg overflow-hidden shadow-lg group"
                        >
                            <Link to={`/posts/${post.post_category_id.slug}/${post.slug}`}>
                                <div className="relative group-hover:scale-105 transition-all duration-300">
                                    <img
                                        src={post.thumbnail}
                                        alt={post.title}
                                        className="w-full h-56 object-cover rounded-lg group-hover:brightness-75 transition-all duration-300"
                                    />
                                    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-20 transition-all duration-300 group-hover:bg-opacity-50"></div>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-2xl font-semibold text-black group-hover:text-blue-500 transition-all duration-300 line-clamp-1">
                                        {post.title}
                                    </h3>
                                    <p
                                        className="line-clamp-2 text-gray-700"
                                        dangerouslySetInnerHTML={{
                                            __html: sanitizedDescription(post.description),
                                        }}
                                    >
                                    </p>
                                    <div className='flex items-center justify-between'>
                                        <span className='text-lg flex items-center'>
                                            <EyeOutlined />
                                            <span className='ml-2 text-sm'>{post.views}</span>
                                        </span>
                                        <span className='text-lg flex items-center'>
                                            <FaRegClock />
                                            <span className='ml-2 text-sm'>
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </span>
                                        </span>
                                    </div>

                                </div>

                            </Link>
                        </div>
                    ))}
                </div>
                <div className="text-center pt-14">
                    <Link
                        to="/posts/hoc-thuat"
                        className="text-white  bg-blue-500 hover:bg-white hover:text-blue-500 hover:border border-blue-500 transition-all duration-300 font-semibold px-4 py-6"
                    >
                        Xem tất cả
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default AcademicSection;
