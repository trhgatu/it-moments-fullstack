import React from 'react';
import { Link } from 'react-router-dom';

const PostSection = ({ postData }) => {
    return (
        <div className="w-full min-h-48 h-full">
            <div className="grid grid-cols-1 gap-8">
                {postData.map((post, index) => (
                    <div
                        key={index}

                        className="relative p-4 h-72 bg-white border border-1 transition duration-300 ease-in-out flex items-start"
                    >
                        {/* Background image */}
                        <div
                            className="absolute inset-0 bg-cover bg-center z-0"
                            style={{ backgroundImage: `url(${post.thumbnail})` }}
                        ></div>

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>

                        {/* Content */}
                        <div className="relative z-20 flex flex-col flex-grow">
                            {/* Badge: Đặt ở góc trên bên trái */}
                            <div className="absolute top-0 left-0 bg-blue-500 text-white text-xl px-2 py-1 z-20">
                                {post.post_category_id?.title}
                            </div>

                            {/* Title and Description: Đặt dưới badge */}
                            <div className="relative z-10 mt-32">
                                <Link
                                    to={`posts/${post.post_category_id?.slug}/${post.slug}`}
                                    className="font-semibold text-lg text-white hover:text-blue-600 transition duration-300 ease-in-out"
                                >
                                    {post.title}
                                </Link>
                                <p className="text-white text-sm leading-8 line-clamp-2 m-0">
                                    {post.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostSection;
