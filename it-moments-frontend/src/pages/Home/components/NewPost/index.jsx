import React from 'react';
import { EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const NewPost = ({ postData }) => {
    if (!postData || postData.length === 0) {
        return <div className="text-center">Không có bài viết mới.</div>;
    }

    const post = postData[0]; // Lấy bài viết đầu tiên trong danh sách (hoặc xử lý theo ý muốn)

    return (
        <div className="relative block md:col-span-2 min-h-48 h-full">
            {post && (
                <div
                    className="relative overflow-hidden h-full flex flex-col justify-end p-8 bg-cover bg-center text-white"
                    style={{ backgroundImage: `url(${post.thumbnail || 'https://via.placeholder.com/600x400'})` }}
                >
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>

                    <div className="absolute top-4 left-4 bg-blue-500 text-white px-2 py-1 rounded">
                        <Link to={`/posts/${post.post_category_id.slug}`} className="text-white font-semibold hover:text-blue-500 transition">
                            {post.post_category_id.title}
                        </Link>
                    </div>

                    <div className="relative z-10 mt-12">
                        <h2 className="text-4xl md:text-3xl font-semibold mt-2 hover:text-blue-500 transition">
                            <Link to={`/posts/${post.post_category_id.slug}/${post.slug}`}>{post.title}</Link>
                        </h2>
                        <div className='line-clamp-2'
                            dangerouslySetInnerHTML={{
                                __html: post.description,
                            }}
                        />
                    </div>
                    <div className="flex justify-between text-sm text-gray-200 mt-4">
                        <div className='flex items-center text-white'>
                            <EyeOutlined className='text-lg' />
                            <span className='text-lg ml-2'>
                                {post.views}
                            </span>
                        </div>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewPost;
