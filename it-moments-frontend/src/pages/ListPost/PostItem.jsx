import React from 'react';
import PropTypes from 'prop-types';
import { FaUser, FaCalendarAlt } from 'react-icons/fa';

const PostItem = ({ title, author, date, imageUrl, category }) => {
    return (
        <div
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer mb-8 mx-auto hover:opacity-100 opacity-90"
            style={{ transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out', maxWidth: '700px' }}
        >
            <div className="relative">
                <img 
                    src={imageUrl} 
                    alt={title} 
                    className="w-full h-80 sm:h-72 md:h-80 lg:h-96 object-cover rounded-t-lg transition-transform duration-300 transform hover:scale-105"  
                    loading="lazy" 
                />
                <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-700 to-purple-400 text-white px-3 py-1 text-xs font-medium rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105 hover:shadow-xl"
                    style={{ borderRadius: '12px' }}>
                    {category}
                </div>
            </div>
            <div className="p-6 flex flex-col justify-between h-auto">
                <h3 className="text-blue-800 font-extrabold text-3xl sm:text-2xl md:text-3xl mb-3 hover:text-orange-500 transition-colors duration-300 leading-tight">
                    {title.length > 70 ? `${title.substring(0, 70)}...` : title}
                </h3>
                <p className="text-gray-700 text-base sm:text-sm mb-4 leading-relaxed line-clamp-3">
                    Mô tả chi tiết về bài viết, cung cấp thông tin hữu ích và thu hút người đọc quan tâm đến bài viết...
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                        <FaUser className="mr-2 text-lg text-gray-700" /> {author}
                    </span>
                    <span className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-lg text-gray-700" /> {date}
                    </span>
                </div>
                <div className="flex justify-end">
                    <button className="bg-blue-600 text-white py-2 px-5 rounded-lg hover:bg-blue-700 hover:shadow-md transition-all duration-200 text-sm">
                        Xem chi tiết
                    </button>
                </div>
            </div>
        </div>
    );
};

PostItem.propTypes = {
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired
};

export default PostItem;
