import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/config'; // Thay đổi với đúng URL của API
import { useParams } from 'react-router-dom';
import { Divider } from 'antd';

const RelatedPosts = ({ eventId }) => {
    const { category } = useParams();
    const [relatedPosts, setRelatedPosts] = useState([]);

    useEffect(() => {
        const fetchRelatedPosts = async () => {
            try {
                const response = await axios.get(`${API_URL}/posts`, {
                    params: {
                        event_id: eventId,
                        category,
                    },
                });

                setRelatedPosts(response.data.data.posts || []);
            } catch(error) {
                console.error("Lỗi khi tải bài viết liên quan:", error);
            }
        };

        if(eventId) {
            fetchRelatedPosts();
        }
    }, [eventId, category]);

    const handlePostClick = (slug) => {
        window.location.href = `/posts/${category}/${slug}`;
    };

    return (
        <div className=" bg-white rounded-xl">
            <p className="px-2 py-4 text-2xl text-white bg-black font-bold flex justify-center">
                Bài viết liên quan
            </p>
            <div className="flex flex-col space-y-4 p-6">
                {relatedPosts.length > 0 ? (
                    relatedPosts.map((post) => (
                        <div
                            key={post._id}
                            onClick={() => handlePostClick(post.slug)}
                            className="cursor-pointer group rounded-lg border border-gray-200 bg-white transition-shadow"
                        >
                            <div className="relative overflow-hidden rounded-t-lg">
                                <img
                                    src={post.thumbnail || 'https://via.placeholder.com/150'}
                                    alt={post.title}
                                    className="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            <div className='hover:bg-gray-50'>
                                <div className="p-6">
                                    <span className="bg-blue-600 text-white font-semibold px-2 py-1">
                                        {post.post_category_id.title}
                                    </span>
                                    <h3 className="text-lg font-semibold text-black group-hover:text-blue-600 transition-colors duration-300 pt-4">
                                        {post.title}
                                    </h3>
                                    <div className='line-clamp-2'
                                        dangerouslySetInnerHTML={{
                                            __html: post.description,
                                        }}
                                    />
                                </div>
                            </div>

                        </div>
                    ))
                ) : (
                    <p className="text-gray-600">Không có bài viết liên quan.</p>
                )}
            </div>
        </div>
    );
};

export default RelatedPosts;
